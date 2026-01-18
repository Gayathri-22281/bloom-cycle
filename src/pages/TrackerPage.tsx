import { Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PeriodCalendar } from "@/components/tracker/PeriodCalendar";

export default function TrackerPage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Period Tracker 🌷
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Click on dates to mark your period days. We'll calculate your cycle and predict your next period.
            </p>
          </div>

          <PeriodCalendar />
        </div>
      </div>
    </Layout>
  );
}
