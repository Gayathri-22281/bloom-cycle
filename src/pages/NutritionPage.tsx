import { useState } from "react";
import { Apple, Utensils, Droplets, Sparkles, Heart, Moon, Sun, Flower } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PeriodColor = "bright-red" | "dark-brown" | "black" | "maroon" | null;
type MenstrualPhase = "menstrual" | "follicular" | "ovulation" | "luteal";

const periodColors = [
  {
    id: "bright-red" as PeriodColor,
    name: "Bright Red",
    color: "#DC2626",
    description: "Fresh blood, beginning of period",
    phase: "menstrual" as MenstrualPhase,
  },
  {
    id: "dark-brown" as PeriodColor,
    name: "Dark Brown",
    color: "#78350F",
    description: "Older blood, end of period",
    phase: "menstrual" as MenstrualPhase,
  },
  {
    id: "black" as PeriodColor,
    name: "Black",
    color: "#1C1917",
    description: "Oxidized blood, end of cycle",
    phase: "menstrual" as MenstrualPhase,
  },
  {
    id: "maroon" as PeriodColor,
    name: "Maroon",
    color: "#7F1D1D",
    description: "Mix of fresh and older blood",
    phase: "menstrual" as MenstrualPhase,
  },
];

const phases = [
  {
    id: "menstrual" as MenstrualPhase,
    name: "Menstrual Phase",
    days: "Days 1-5",
    icon: Droplets,
    color: "from-rose-400 to-red-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Your body needs iron & hydration during this time",
    motivation: "Your body needs rest and nourishment 💗",
    foods: [
      { emoji: "🍎", name: "Apple", benefit: "Rich in iron & fiber" },
      { emoji: "🍊", name: "Orange", benefit: "Vitamin C boost" },
      { emoji: "🍉", name: "Watermelon", benefit: "Hydration & minerals" },
      { emoji: "🍍", name: "Pineapple", benefit: "Anti-inflammatory" },
      { emoji: "🍓", name: "Strawberry", benefit: "Antioxidants & iron" },
    ],
  },
  {
    id: "follicular" as MenstrualPhase,
    name: "Follicular Phase",
    days: "Days 6-13",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Energy slowly increases, fresh start",
    motivation: "Fresh foods for a fresh start ✨",
    foods: [
      { emoji: "🍌", name: "Banana", benefit: "Energy & potassium" },
      { emoji: "🍎", name: "Apple", benefit: "Fiber & vitamins" },
      { emoji: "🥝", name: "Kiwi", benefit: "Vitamin C & digestion" },
      { emoji: "🍇", name: "Grapes", benefit: "Natural energy" },
      { emoji: "🍐", name: "Pear", benefit: "Gentle fiber" },
    ],
  },
  {
    id: "ovulation" as MenstrualPhase,
    name: "Ovulation Phase",
    days: "Days 14-16",
    icon: Flower,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Hormones peak, support your balance",
    motivation: "Support your balance 🌸",
    foods: [
      { emoji: "🫐", name: "Blueberries", benefit: "Antioxidant power" },
      { emoji: "🍒", name: "Cherries", benefit: "Anti-inflammatory" },
      { emoji: "🍍", name: "Pineapple", benefit: "Hormone support" },
      { emoji: "🍓", name: "Mixed Berries", benefit: "Nutrient-dense" },
      { emoji: "🍊", name: "Citrus", benefit: "Vitamin boost" },
    ],
  },
  {
    id: "luteal" as MenstrualPhase,
    name: "Luteal Phase",
    days: "Days 17-28",
    icon: Moon,
    color: "from-purple-400 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "PMS phase - mood swings & bloating possible",
    motivation: "Be kind to yourself 💕",
    warning: "Avoid excess sugar – it may worsen PMS symptoms",
    foods: [
      { emoji: "🍌", name: "Banana", benefit: "Mood & cramps relief" },
      { emoji: "🥭", name: "Mango", benefit: "Vitamin A & energy" },
      { emoji: "🍑", name: "Peach", benefit: "Gentle & soothing" },
      { emoji: "🍊", name: "Orange", benefit: "Immune support" },
      { emoji: "🥝", name: "Kiwi", benefit: "Sleep & digestion" },
    ],
  },
];

function BloodDroplet({ color, isSelected, onClick }: { color: typeof periodColors[0]; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 group",
        isSelected ? "scale-105 shadow-lg" : "hover:scale-102 hover:shadow-md",
        isSelected ? "bg-card border-2 border-primary" : "bg-card/50 border border-border hover:border-primary/50"
      )}
    >
      <svg
        viewBox="0 0 60 80"
        className={cn(
          "w-12 h-16 drop-shadow-md transition-transform duration-300",
          isSelected && "animate-pulse"
        )}
      >
        <defs>
          <linearGradient id={`gradient-${color.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color.color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M30 0 C30 0 0 40 0 55 C0 70 13 80 30 80 C47 80 60 70 60 55 C60 40 30 0 30 0 Z"
          fill={`url(#gradient-${color.id})`}
        />
        <ellipse cx="20" cy="45" rx="6" ry="8" fill="white" opacity="0.3" />
      </svg>
      <span className={cn(
        "text-xs font-medium text-center transition-colors",
        isSelected ? "text-foreground" : "text-muted-foreground"
      )}>
        {color.name}
      </span>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 text-primary-foreground fill-current" />
        </div>
      )}
    </button>
  );
}

function SmilingFood({ food, delay }: { food: { emoji: string; name: string; benefit: string }; delay: number }) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl group-hover:animate-bounce transition-transform">
        {food.emoji}
      </div>
      <span className="font-medium text-sm text-foreground">{food.name}</span>
      <span className="text-xs text-muted-foreground text-center">{food.benefit}</span>
    </div>
  );
}

function PhaseCard({ phase, isActive }: { phase: typeof phases[0]; isActive: boolean }) {
  const Icon = phase.icon;
  
  return (
    <Card className={cn(
      "transition-all duration-500 overflow-hidden",
      isActive ? "ring-2 ring-primary shadow-xl" : "opacity-60 hover:opacity-80"
    )}>
      <CardHeader className={cn("relative", phase.bgColor)}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-20",
          phase.color
        )} />
        <div className="relative flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r shadow-lg",
            phase.color
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{phase.name}</CardTitle>
            <Badge variant="outline" className={phase.borderColor}>{phase.days}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-muted-foreground">{phase.description}</p>
        
        {isActive && (
          <>
            <div className={cn(
              "p-4 rounded-xl text-center",
              phase.bgColor
            )}>
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-lg font-medium text-foreground">{phase.motivation}</p>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {phase.foods.map((food, idx) => (
                <SmilingFood key={food.name} food={food} delay={idx * 100} />
              ))}
            </div>
            
            {phase.warning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-sm text-amber-700">⚠️ {phase.warning}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function NutritionPage() {
  const [selectedColor, setSelectedColor] = useState<PeriodColor>(null);
  const [selectedPhase, setSelectedPhase] = useState<MenstrualPhase>("menstrual");

  const handleColorSelect = (color: typeof periodColors[0]) => {
    setSelectedColor(color.id);
    setSelectedPhase(color.phase);
  };

  const handlePhaseSelect = (phase: MenstrualPhase) => {
    setSelectedPhase(phase);
  };

  const activePhase = phases.find(p => p.id === selectedPhase) || phases[0];

  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Food Diet & Nutrition 🍎
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Nourish your body with phase-based food guidance. Select your period color or cycle phase below. 💕
          </p>
        </div>

        {/* Period Color Selection */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Select Your Period Color
            </h2>
            <p className="text-sm text-muted-foreground">
              Your period color can indicate your current stage
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {periodColors.map((color) => (
              <BloodDroplet
                key={color.id}
                color={color}
                isSelected={selectedColor === color.id}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
          
          {selectedColor && (
            <div className="mt-4 p-4 bg-card rounded-xl border border-primary/20 text-center animate-fade-in">
              <p className="text-sm text-muted-foreground">
                {periodColors.find(c => c.id === selectedColor)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Phase Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Or Select Your Cycle Phase
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseSelect(phase.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                    selectedPhase === phase.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card border border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{phase.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Phase Display with Color Indicator */}
        <div className="max-w-4xl mx-auto">
          {selectedColor && (
            <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-card/50 rounded-xl border border-border">
              <svg viewBox="0 0 60 80" className="w-8 h-10">
                <path
                  d="M30 0 C30 0 0 40 0 55 C0 70 13 80 30 80 C47 80 60 70 60 55 C60 40 30 0 30 0 Z"
                  fill={periodColors.find(c => c.id === selectedColor)?.color}
                />
              </svg>
              <span className="text-sm font-medium text-foreground">
                Your color: {periodColors.find(c => c.id === selectedColor)?.name}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Current phase: {activePhase.name}
              </span>
            </div>
          )}
          
          <PhaseCard phase={activePhase} isActive={true} />
          
          {/* Other Phases */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Other Phases
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {phases.filter(p => p.id !== selectedPhase).map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => handlePhaseSelect(phase.id)}
                  className="cursor-pointer"
                >
                  <PhaseCard phase={phase} isActive={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
