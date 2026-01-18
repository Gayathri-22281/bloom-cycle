import { BookOpen } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { TutorialCard } from "@/components/tutorials/TutorialCard";

const tutorials = [
  {
    title: "How to Use Sanitary Pads",
    icon: "🩹",
    description: "A complete beginner's guide to using sanitary pads safely and comfortably.",
    steps: [
      {
        title: "Wash your hands",
        content: "Always start with clean hands to maintain hygiene and prevent infections.",
      },
      {
        title: "Unwrap the pad",
        content: "Remove the pad from its wrapper. Keep the wrapper for disposal later.",
      },
      {
        title: "Peel off the backing",
        content: "Remove the paper strip from the adhesive side of the pad.",
      },
      {
        title: "Position the pad",
        content: "Place the sticky side down on the center of your underwear. Make sure it's aligned properly.",
      },
      {
        title: "Secure the wings",
        content: "If your pad has wings, fold them over the edges of your underwear and press to stick.",
      },
      {
        title: "Change regularly",
        content: "Change your pad every 4-6 hours, or sooner if needed. Never wear one for more than 8 hours.",
      },
    ],
    tips: [
      "Choose the right absorbency for your flow — light, regular, or heavy",
      "Carry extra pads in your bag during your period",
      "Dispose of used pads by wrapping them in the wrapper or toilet paper",
      "Never flush pads down the toilet",
    ],
  },
  {
    title: "How to Use Menstrual Cups",
    icon: "🥤",
    description: "Learn the eco-friendly way to manage your period with menstrual cups.",
    steps: [
      {
        title: "Sterilize the cup",
        content: "Before first use and after each period, boil the cup in water for 5-10 minutes.",
      },
      {
        title: "Wash your hands",
        content: "Clean hands are essential for safe insertion and removal.",
      },
      {
        title: "Fold the cup",
        content: "Use a C-fold or punch-down fold. Find what works best for you.",
      },
      {
        title: "Insert gently",
        content: "Relax your muscles, find a comfortable position (squatting or one leg up), and insert the folded cup.",
      },
      {
        title: "Let it open",
        content: "Once inside, let the cup pop open. You can run your finger around the rim to ensure it's fully open.",
      },
      {
        title: "Remove and empty",
        content: "Pinch the base to break the seal, gently pull out, empty, rinse, and reinsert.",
      },
    ],
    tips: [
      "Start practicing before your period to get comfortable",
      "You can wear a cup for up to 12 hours",
      "Trim the stem if it feels uncomfortable",
      "Use water-based lubricant if needed for easier insertion",
      "Menstrual cups are reusable for up to 10 years — great for the environment!",
    ],
  },
  {
    title: "How to Use Tampons",
    icon: "💊",
    description: "Safe and proper tampon use for comfortable period management.",
    steps: [
      {
        title: "Wash your hands",
        content: "Start with clean hands to prevent any bacteria from entering your body.",
      },
      {
        title: "Get comfortable",
        content: "Sit on the toilet, squat, or stand with one leg elevated. Relax!",
      },
      {
        title: "Hold correctly",
        content: "Hold the tampon at the grip (middle) with your thumb and middle finger. Index finger on the end.",
      },
      {
        title: "Insert the tampon",
        content: "Gently insert the top part of the applicator into your vagina at a slight angle toward your back.",
      },
      {
        title: "Push the plunger",
        content: "Push the plunger with your index finger to release the tampon inside.",
      },
      {
        title: "Remove the applicator",
        content: "Pull out the plastic applicator and dispose of it. The string should hang outside your body.",
      },
    ],
    tips: [
      "Start with light or regular absorbency if you're new to tampons",
      "Change every 4-8 hours — never leave in longer than 8 hours",
      "If you feel the tampon, it might not be inserted far enough",
      "Always use the lowest absorbency needed for your flow",
      "Learn about Toxic Shock Syndrome (TSS) and its warning signs",
    ],
  },
];

export default function TutorialsPage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Menstrual Health Tutorials 📘
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Learn everything you need to know about menstrual products. Knowledge is power, and your comfort matters. 💕
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {tutorials.map((tutorial, index) => (
            <TutorialCard key={index} {...tutorial} />
          ))}
        </div>

        {/* Myths Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-6 md:p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
              Breaking Menstrual Myths 🌟
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-destructive mb-2">❌ Myth</p>
                <p className="text-sm text-muted-foreground">"You can't exercise during your period"</p>
                <p className="font-medium text-green-600 mt-3 mb-2">✅ Truth</p>
                <p className="text-sm text-muted-foreground">Gentle exercise can actually help reduce cramps and improve mood!</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-destructive mb-2">❌ Myth</p>
                <p className="text-sm text-muted-foreground">"Periods should be hidden and shameful"</p>
                <p className="font-medium text-green-600 mt-3 mb-2">✅ Truth</p>
                <p className="text-sm text-muted-foreground">Menstruation is a natural, healthy process. There's nothing to be ashamed of!</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-destructive mb-2">❌ Myth</p>
                <p className="text-sm text-muted-foreground">"You lose a lot of blood during periods"</p>
                <p className="font-medium text-green-600 mt-3 mb-2">✅ Truth</p>
                <p className="text-sm text-muted-foreground">Most women only lose 2-3 tablespoons of blood during their entire period.</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-destructive mb-2">❌ Myth</p>
                <p className="text-sm text-muted-foreground">"PMS isn't real"</p>
                <p className="font-medium text-green-600 mt-3 mb-2">✅ Truth</p>
                <p className="text-sm text-muted-foreground">PMS is a real condition caused by hormonal changes. Your feelings are valid!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
