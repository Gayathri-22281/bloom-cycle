import { useState } from "react";
import { MapPin, Navigation, Search, Building2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ClinicsPage() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEnableLocation = () => {
    setLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Open Google Maps with nearby gynecologists search
          const mapsUrl = `https://www.google.com/maps/search/gynecologist+hospital/@${latitude},${longitude},14z`;
          window.open(mapsUrl, "_blank");
          setLocationEnabled(true);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location services and try again.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const mapsUrl = `https://www.google.com/maps/search/gynecologist+${encodeURIComponent(searchQuery)}`;
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Find Nearby Clinics 🏥
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Locate gynecologists and women's health clinics near you. Your health matters! 💕
            </p>
          </div>

          <div className="space-y-6">
            {/* Location Card */}
            <Card className="border-primary/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Use Your Location
                </CardTitle>
                <CardDescription>
                  Find the nearest gynecologists and women's health clinics based on your current location.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Button 
                  onClick={handleEnableLocation} 
                  disabled={loading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5" />
                      {locationEnabled ? "Search Again" : "Enable Location & Find Clinics"}
                    </>
                  )}
                </Button>
                {locationEnabled && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    ✅ A new tab should have opened with nearby clinics on Google Maps.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Search Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Search by City or Area
                </CardTitle>
                <CardDescription>
                  Prefer to search by location name? Enter your city or area below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city or area name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-primary/10">
                <CardContent className="p-5">
                  <Building2 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">When to Visit a Gynecologist</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Irregular or very painful periods</li>
                    <li>• Unusually heavy bleeding</li>
                    <li>• Missing periods for 3+ months</li>
                    <li>• Unusual discharge or odor</li>
                    <li>• Annual wellness check-up</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardContent className="p-5">
                  <MapPin className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">What to Bring</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your period tracking data</li>
                    <li>• List of any medications</li>
                    <li>• Questions you want to ask</li>
                    <li>• Insurance/ID if applicable</li>
                    <li>• A supportive friend/family (optional)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Reassurance */}
            <Card className="bg-accent/30 border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  💕 Remember: Visiting a gynecologist is a normal and important part of taking care of your health. 
                  There's nothing to be embarrassed about. Your well-being matters!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
