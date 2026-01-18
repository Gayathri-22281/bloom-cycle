import { Package } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StockReminder } from "@/components/stock/StockReminder";

export default function StockPage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Stock Reminder 🧴
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Never run out of essentials! We'll remind you when it's time to restock based on your cycle.
            </p>
          </div>

          <StockReminder />
        </div>
      </div>
    </Layout>
  );
}
