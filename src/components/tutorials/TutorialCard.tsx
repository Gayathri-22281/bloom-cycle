import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TutorialStep {
  title: string;
  content: string;
}

interface TutorialCardProps {
  title: string;
  icon?: string;
  iconComponent?: ReactNode;
  description: string;
  steps: TutorialStep[];
  tips: string[];
}

export function TutorialCard({ title, icon, iconComponent, description, steps, tips }: TutorialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {iconComponent ? (
              <div className="shrink-0">{iconComponent}</div>
            ) : (
              <span className="text-3xl">{icon}</span>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[2000px]" : "max-h-0"
      )}>
        <CardContent className="pt-0 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2 text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Step-by-Step Guide
            </h4>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-accent/30 rounded-xl p-4">
            <h4 className="font-semibold text-foreground mb-3">💡 Pro Tips</h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
