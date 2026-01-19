import { Droplets, ClipboardCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PeriodColorGuide } from "@/components/period-color/PeriodColorGuide";
import { PCODScreening } from "@/components/chatbot/PCODScreening";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HealthGuidePage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Droplets className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Health Guide 🩺
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Understand your body better with our color-based health guide and PCOD screening tool. 💕
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="color-guide" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="color-guide" className="gap-2">
                <Droplets className="h-4 w-4" />
                Period Color Guide
              </TabsTrigger>
              <TabsTrigger value="pcod" className="gap-2">
                <ClipboardCheck className="h-4 w-4" />
                PCOD Screening
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color-guide">
              <PeriodColorGuide />
            </TabsContent>

            <TabsContent value="pcod">
              <PCODScreening />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
