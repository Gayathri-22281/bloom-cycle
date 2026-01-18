import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExerciseCardProps {
  title: string;
  description: string;
  phase: "before" | "during" | "after";
  videoId: string;
  duration: string;
}

const phaseColors = {
  before: "bg-blue-100 text-blue-700 border-blue-200",
  during: "bg-primary/10 text-primary border-primary/20",
  after: "bg-green-100 text-green-700 border-green-200",
};

const phaseLabels = {
  before: "Before Period",
  during: "During Period",
  after: "After Period",
};

export function ExerciseCard({ title, description, phase, videoId, duration }: ExerciseCardProps) {
  return (
    <Card className="group overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute top-3 left-3">
          <Badge className={phaseColors[phase]}>{phaseLabels[phase]}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
            {duration}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
          <Play className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
