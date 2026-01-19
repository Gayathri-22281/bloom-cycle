import { useState } from "react";
import { ClipboardCheck, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
}

const pcodQuestions: Question[] = [
  {
    id: "q1",
    text: "Do you have irregular, delayed, or missed menstrual periods?"
  },
  {
    id: "q2", 
    text: "Do you notice excessive hair growth on your face, chest, abdomen, or back?"
  },
  {
    id: "q3",
    text: "Do you experience frequent acne or very oily skin?"
  },
  {
    id: "q4",
    text: "Do you find it difficult to lose weight or gain weight easily?"
  },
  {
    id: "q5",
    text: "Do you experience hair thinning or hair loss on your scalp?"
  },
  {
    id: "q6",
    text: "Have you ever been diagnosed with hormonal imbalance or ovarian cysts?"
  }
];

interface PCODScreeningProps {
  onComplete?: (score: number) => void;
}

export function PCODScreening({ onComplete }: PCODScreeningProps) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;
  const yesCount = Object.values(answers).filter(a => a === true).length;
  const allAnswered = answeredCount === pcodQuestions.length;

  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setShowResult(true);
    onComplete?.(yesCount);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  const getRiskLevel = () => {
    if (yesCount >= 4) return { level: "High", color: "text-destructive", bg: "bg-destructive/10" };
    if (yesCount >= 2) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { level: "Low", color: "text-green-600", bg: "bg-green-50" };
  };

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          PCOD/PCOS Screening Tool
        </CardTitle>
        <CardDescription>
          Answer these questions to understand your symptoms better
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Disclaimer */}
        <div className="bg-accent/30 rounded-xl p-4 mb-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Important Notice</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a preliminary screening tool, <strong>NOT a medical diagnosis</strong>. 
                Please consult a healthcare professional for proper evaluation and diagnosis.
              </p>
            </div>
          </div>
        </div>

        {!showResult ? (
          <>
            {/* Questions */}
            <div className="space-y-4">
              {pcodQuestions.map((question, index) => (
                <div 
                  key={question.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200",
                    answers[question.id] !== null && answers[question.id] !== undefined
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                    {question.text}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant={answers[question.id] === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAnswer(question.id, true)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      variant={answers[question.id] === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAnswer(question.id, false)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      No
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress & Submit */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Questions answered</span>
                <span>{answeredCount} / {pcodQuestions.length}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / pcodQuestions.length) * 100}%` }}
                />
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full"
              >
                Get Screening Results
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Results */}
            <div className={cn("p-6 rounded-xl text-center", getRiskLevel().bg)}>
              <h3 className={cn("text-2xl font-bold mb-2", getRiskLevel().color)}>
                {getRiskLevel().level} Risk Indication
              </h3>
              <p className="text-foreground">
                You answered <strong>Yes</strong> to {yesCount} out of {pcodQuestions.length} questions.
              </p>
            </div>

            {/* Recommendations based on score */}
            <div className="bg-card rounded-xl p-4 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">💕 What This Means</h4>
              {yesCount >= 4 ? (
                <p className="text-sm text-muted-foreground">
                  Your responses suggest you may be experiencing several symptoms commonly associated with PCOS/PCOD. 
                  <strong className="text-foreground"> We strongly recommend consulting a gynecologist</strong> for proper 
                  evaluation, testing, and personalized guidance.
                </p>
              ) : yesCount >= 2 ? (
                <p className="text-sm text-muted-foreground">
                  You're showing some symptoms that could be related to hormonal changes. 
                  <strong className="text-foreground"> Consider scheduling a check-up</strong> with a healthcare provider 
                  to discuss your concerns and get proper assessment.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Based on your responses, you're showing minimal symptoms. Continue maintaining a healthy lifestyle 
                  and regular health check-ups. <strong className="text-foreground">Stay aware of any changes</strong> in your menstrual cycle.
                </p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/30">
              <p className="text-sm text-center text-foreground">
                💗 Remember: Early detection and lifestyle changes can make a big difference. 
                You're not alone in this journey!
              </p>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Retake Screening
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
