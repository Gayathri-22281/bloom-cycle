import { useState, useEffect } from "react";
import { Package, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePeriodTracker } from "@/hooks/usePeriodTracker";

interface PurchaseRecord {
  date: string;
  product: string;
  month: string;
}

const STORAGE_KEY = "femcare_purchases";

const products = [
  { id: "pads", name: "Sanitary Pads", emoji: "🩹", zeptoSearch: "sanitary+pads" },
  { id: "cup", name: "Menstrual Cup", emoji: "🥤", zeptoSearch: "menstrual+cup" },
  { id: "tampons", name: "Tampons", emoji: "💊", zeptoSearch: "tampons" },
];

export function StockReminder() {
  const { periodData } = usePeriodTracker();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  }, [purchases]);

  const daysUntilNext = periodData.nextExpectedDate
    ? Math.ceil((new Date(periodData.nextExpectedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const needsReminder = daysUntilNext !== null && daysUntilNext <= 7 && daysUntilNext > 0;

  const handleBuyNow = (product: typeof products[0]) => {
    const url = `https://www.zeptonow.com/search?query=${product.zeptoSearch}`;
    window.open(url, "_blank");
    setSelectedProduct(product.id);
  };

  const markAsPurchased = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const now = new Date();
      setPurchases(prev => [...prev, {
        date: now.toISOString(),
        product: product.name,
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' })
      }]);
      setSelectedProduct(null);
    }
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const thisMonthPurchases = purchases.filter(p => p.month === currentMonth);

  return (
    <div className="space-y-6">
      {/* Stock Alert */}
      {needsReminder && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/20 shadow-lg animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  🌸 Your menstrual stock may be low for the upcoming cycle
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your next period is expected in <strong>{daysUntilNext} days</strong>. Make sure you're prepared!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Selection */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Restore Your Stock
          </CardTitle>
          <CardDescription>Choose a product to order from Zepto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="space-y-3">
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/40 border-2"
                  onClick={() => handleBuyNow(product)}
                >
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">{product.emoji}</span>
                    <p className="font-medium text-foreground">{product.name}</p>
                  </CardContent>
                </Card>
                {selectedProduct === product.id && (
                  <Button 
                    onClick={() => markAsPurchased(product.id)}
                    className="w-full"
                    variant="default"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Purchased
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Purchase History
          </CardTitle>
          <CardDescription>Your menstrual product purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No purchases recorded yet. Start tracking your stock!
            </p>
          ) : (
            <div className="space-y-3">
              {[...purchases].reverse().slice(0, 10).map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div>
                    <p className="font-medium text-foreground">{purchase.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{purchase.month}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
