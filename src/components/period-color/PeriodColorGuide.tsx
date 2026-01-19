import { useState } from "react";
import { Heart, Sparkles, Apple, Salad, Coffee, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorInfo {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  stage: string;
  description: string;
  healthAdvice: string[];
  foods: {
    name: string;
    emoji: string;
    benefit: string;
  }[];
  motivationalMessage: string;
}

const periodColors: ColorInfo[] = [
  {
    id: "bright-red",
    name: "Bright Red",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    stage: "Fresh Flow (Days 1-2)",
    description: "This indicates fresh blood and a healthy start to your period. Your uterine lining is shedding normally.",
    healthAdvice: [
      "Stay well hydrated with water and herbal teas",
      "Use heat therapy for any cramps",
      "Get adequate rest and sleep",
      "Consider light exercise like walking or yoga"
    ],
    foods: [
      { name: "Spinach", emoji: "🥬", benefit: "Iron-rich to replenish blood" },
      { name: "Bananas", emoji: "🍌", benefit: "Potassium to reduce bloating" },
      { name: "Dark Chocolate", emoji: "🍫", benefit: "Magnesium for cramp relief" },
      { name: "Salmon", emoji: "🐟", benefit: "Omega-3 to reduce inflammation" }
    ],
    motivationalMessage: "You're doing amazing! 💪 Your body is working perfectly. Rest and nourish yourself today! 🌸"
  },
  {
    id: "dark-brown",
    name: "Dark Brown",
    color: "bg-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    stage: "End of Period (Days 4-5)",
    description: "Brown blood is older blood that has taken longer to leave your body. This is completely normal at the end of your period.",
    healthAdvice: [
      "Continue with gentle exercise",
      "Maintain good hygiene practices",
      "Your energy levels may start increasing",
      "Great time to start light workouts again"
    ],
    foods: [
      { name: "Avocados", emoji: "🥑", benefit: "Healthy fats for hormone balance" },
      { name: "Berries", emoji: "🫐", benefit: "Antioxidants for recovery" },
      { name: "Eggs", emoji: "🥚", benefit: "Protein for energy restoration" },
      { name: "Oranges", emoji: "🍊", benefit: "Vitamin C for iron absorption" }
    ],
    motivationalMessage: "Almost there! 🌟 Your body is wrapping up beautifully. You've been so strong! 💕"
  },
  {
    id: "black",
    name: "Black/Very Dark",
    color: "bg-gray-900",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-400",
    stage: "Oxidized Blood",
    description: "Very dark or black blood is old blood that has oxidized. Often appears at the very start or end of your period.",
    healthAdvice: [
      "This is usually normal, especially at period start/end",
      "If persistent with heavy flow, consider consulting a doctor",
      "Stay hydrated and maintain iron levels",
      "Track patterns for your health records"
    ],
    foods: [
      { name: "Lean Beef", emoji: "🥩", benefit: "Iron to prevent anemia" },
      { name: "Lentils", emoji: "🥣", benefit: "Plant-based iron and fiber" },
      { name: "Nuts", emoji: "🥜", benefit: "Vitamin E for blood health" },
      { name: "Broccoli", emoji: "🥦", benefit: "Iron and vitamin C combo" }
    ],
    motivationalMessage: "Listen to your body! 🤗 Every period is unique. You're taking great care of yourself! 💗"
  },
  {
    id: "maroon",
    name: "Maroon/Dark Red",
    color: "bg-rose-900",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
    stage: "Peak Flow (Days 2-3)",
    description: "Maroon or dark red blood typically appears during the heaviest days of your period when flow is at its peak.",
    healthAdvice: [
      "This is your heaviest flow - change products regularly",
      "Focus on iron-rich foods to prevent fatigue",
      "Rest when needed - it's okay to slow down",
      "Use overnight protection while sleeping"
    ],
    foods: [
      { name: "Red Meat", emoji: "🍖", benefit: "High iron content" },
      { name: "Pomegranate", emoji: "🍎", benefit: "Natural blood builder" },
      { name: "Beets", emoji: "🫒", benefit: "Iron and folate" },
      { name: "Quinoa", emoji: "🌾", benefit: "Complete protein and iron" }
    ],
    motivationalMessage: "You're incredibly strong! 💪 Heavy days are tough, but you've got this. Be extra kind to yourself today! 🌺"
  }
];

export function PeriodColorGuide() {
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [showFoods, setShowFoods] = useState(false);

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Period Blood Color Guide
          </CardTitle>
          <CardDescription>
            Select your current period color to get personalized health advice and food recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {periodColors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedColor(color);
                  setShowFoods(false);
                }}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105",
                  selectedColor?.id === color.id
                    ? `${color.borderColor} ${color.bgColor} shadow-lg`
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full mb-3", color.color)} />
                <span className="font-medium text-sm text-foreground text-center">{color.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Color Details */}
      {selectedColor && (
        <div className="space-y-4 animate-fade-in">
          {/* Stage Badge */}
          <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium", selectedColor.bgColor, selectedColor.borderColor, "border")}>
            <div className={cn("w-3 h-3 rounded-full", selectedColor.color)} />
            {selectedColor.stage}
          </div>

          {/* Health Information */}
          <Card className={cn("border-2", selectedColor.borderColor, selectedColor.bgColor)}>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  What This Means
                </h3>
                <p className="text-muted-foreground">{selectedColor.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">💡 Health Tips</h4>
                <ul className="space-y-2">
                  {selectedColor.healthAdvice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Motivational Message */}
              <div className="bg-card rounded-xl p-4 border border-primary/20">
                <p className="text-center text-foreground font-medium">
                  <Sparkles className="h-4 w-4 inline-block text-primary mr-2" />
                  {selectedColor.motivationalMessage}
                </p>
              </div>

              {/* Show Foods Button */}
              <Button 
                onClick={() => setShowFoods(!showFoods)}
                className="w-full"
                variant="default"
              >
                <Salad className="h-4 w-4 mr-2" />
                {showFoods ? "Hide Food Recommendations" : "Show Food Recommendations 🍎"}
              </Button>
            </CardContent>
          </Card>

          {/* Food Recommendations with Animation */}
          {showFoods && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              {selectedColor.foods.map((food, index) => (
                <Card 
                  key={index} 
                  className="border-primary/20 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${index * 150}ms`, animationDuration: '2s' }}>
                      {food.emoji}
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{food.name}</h4>
                    <p className="text-xs text-muted-foreground">{food.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showFoods && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/10 animate-fade-in">
              <CardContent className="p-4 text-center">
                <Apple className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-foreground font-medium">
                  Nourish your body with love! 💕
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  These foods are specially chosen to support you during the {selectedColor.stage.toLowerCase()} phase.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
