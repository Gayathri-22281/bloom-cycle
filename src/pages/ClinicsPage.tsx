import { useState, useEffect } from "react";
import { MapPin, Navigation, Search, Building2, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ClinicsPage() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get location on mount
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setLocationError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationEnabled(true);
          setLoading(false);
          
          // Create embedded map URL for nearby gynecologists
          const embedUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=gynecologist+hospital+near+me&center=${latitude},${longitude}&zoom=14`;
          setMapUrl(embedUrl);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(getLocationErrorMessage(error.code));
          setLoading(false);
          // Set a default map showing general gynecologist search
          setMapUrl(`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=gynecologist+hospital`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLoading(false);
      setMapUrl(`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=gynecologist+hospital`);
    }
  };

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return "Location permission denied. Please enable location access in your browser settings.";
      case 2:
        return "Unable to determine your location. Please try again.";
      case 3:
        return "Location request timed out. Please try again.";
      default:
        return "Unable to get your location. Please try again.";
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=gynecologist+hospital+${encodeURIComponent(searchQuery)}`;
      setMapUrl(searchUrl);
    }
  };

  const openInGoogleMaps = () => {
    if (userLocation) {
      const mapsUrl = `https://www.google.com/maps/search/gynecologist+hospital/@${userLocation.lat},${userLocation.lng},14z`;
      window.open(mapsUrl, "_blank");
    } else if (searchQuery.trim()) {
      const mapsUrl = `https://www.google.com/maps/search/gynecologist+${encodeURIComponent(searchQuery)}`;
      window.open(mapsUrl, "_blank");
    } else {
      window.open("https://www.google.com/maps/search/gynecologist+hospital+near+me", "_blank");
    }
  };

  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
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
            {/* Location Status & Search */}
            <Card className="border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Find Gynecologists Near You
                </CardTitle>
                <CardDescription>
                  {locationEnabled 
                    ? "Location detected! Showing nearby clinics on the map below." 
                    : "Enable location to find clinics near you, or search by city/area."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {locationError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {locationError}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={requestLocation} 
                    disabled={loading}
                    variant={locationEnabled ? "outline" : "default"}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        {locationEnabled ? "Refresh Location" : "Use My Location"}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex flex-1 gap-2">
                    <Input
                      placeholder="Or search by city/area..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embedded Google Map */}
            <Card className="border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                {mapUrl ? (
                  <div className="relative">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Nearby Gynecologist Clinics"
                      className="w-full"
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button onClick={openInGoogleMaps} size="sm" className="gap-2 shadow-lg">
                        <Navigation className="h-4 w-4" />
                        Open in Google Maps
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex items-center justify-center bg-accent/20">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-primary mx-auto mb-3 animate-spin" />
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                )}
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
