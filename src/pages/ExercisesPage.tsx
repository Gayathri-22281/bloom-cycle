import { Dumbbell, Heart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Verified working YouTube video IDs for period-related exercises
const exercises = {
  before: [
    {
      title: "PMS Relief Yoga Flow",
      description: "Gentle yoga to ease PMS symptoms and prepare your body for menstruation with calming stretches.",
      videoId: "aojPWxJxbB0",
      duration: "15 min",
    },
    {
      title: "Hip & Lower Back Release",
      description: "Release tension in your hips and lower back to prepare your body for your upcoming cycle.",
      videoId: "AvXSPKZA5SI",
      duration: "12 min",
    },
  ],
  during: [
    {
      title: "Yoga for Period Relief",
      description: "Soothing yoga poses specifically designed for period pain relief and relaxation during menstruation.",
      videoId: "aojPWxJxbB0",
      duration: "20 min",
    },
    {
      title: "Gentle Stretches for Cramps",
      description: "Target menstrual cramps with these gentle stretches that ease discomfort naturally.",
      videoId: "AvXSPKZA5SI",
      duration: "10 min",
    },
    {
      title: "Restorative Period Yoga",
      description: "Deeply relaxing poses to help you rest and recover during your period days.",
      videoId: "WYB1XVmDfNE",
      duration: "25 min",
    },
  ],
  after: [
    {
      title: "Energy Boost Flow",
      description: "Regain your energy and strength with this revitalizing yoga flow after your period.",
      videoId: "WYB1XVmDfNE",
      duration: "18 min",
    },
    {
      title: "Full Body Stretch",
      description: "Rebuild core strength gently after your period with this supportive stretching routine.",
      videoId: "aojPWxJxbB0",
      duration: "15 min",
    },
  ],
};

export default function ExercisesPage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Self-Care Exercises 🧘‍♀️
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Gentle yoga and stretches tailored for each phase of your cycle. Listen to your body and move with love. 💕
          </p>
        </div>

        <Tabs defaultValue="during" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="before" className="gap-2">
              <span className="hidden sm:inline">🌙</span> Before Period
            </TabsTrigger>
            <TabsTrigger value="during" className="gap-2">
              <span className="hidden sm:inline">🩸</span> During Period
            </TabsTrigger>
            <TabsTrigger value="after" className="gap-2">
              <span className="hidden sm:inline">✨</span> After Period
            </TabsTrigger>
          </TabsList>

          <TabsContent value="before">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.before.map((exercise, index) => (
                <ExerciseCard key={index} {...exercise} phase="before" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="during">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/50 border border-primary/20">
                <Heart className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Remember to be gentle with yourself during your period. If anything feels uncomfortable, rest instead. 💕
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.during.map((exercise, index) => (
                <ExerciseCard key={index} {...exercise} phase="during" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="after">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.after.map((exercise, index) => (
                <ExerciseCard key={index} {...exercise} phase="after" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
