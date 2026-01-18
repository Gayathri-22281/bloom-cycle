import { useState, useRef, useEffect } from "react";
import { Send, Heart, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isAlert?: boolean;
}

const DISTRESS_KEYWORDS = [
  "want to die", "kill myself", "suicide", "end my life",
  "hopeless", "can't handle", "give up", "worthless",
  "hurt myself", "self harm", "no point", "better off dead"
];

const GUARDIAN_EMAIL = "gayathriumapathy430@gmail.com";

const BOT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello lovely! 💕 I'm here to support you through your wellness journey. How are you feeling today?",
    "Hi there! 🌸 Welcome to FEMCARE. I'm your caring companion. What can I help you with?",
  ],
  period: [
    "Period symptoms can be tough! 💪 Remember to stay hydrated, use a heating pad for cramps, and rest when you need to. You're doing amazing! 🌷",
    "I understand periods can be challenging. Try gentle stretches, warm drinks, and give yourself permission to rest. You've got this! 💕",
  ],
  cramps: [
    "Cramps are no fun! 😔 Try applying heat to your lower abdomen, gentle yoga poses like child's pose, or a warm bath. You deserve comfort! 🛁✨",
    "For cramps, I recommend: 1) Heat therapy 2) Light exercise 3) Stay hydrated 4) Rest well. You're stronger than you know! 💪🌸",
  ],
  mood: [
    "Mood swings are completely normal during your cycle! 🌈 Be gentle with yourself. Try journaling, talking to someone you trust, or doing something that brings you joy. 💕",
    "It's okay to feel emotional! 🤗 Your feelings are valid. Consider some self-care: a warm drink, your favorite show, or a short walk. Sending hugs! 💕",
  ],
  default: [
    "I'm here for you! 💕 While I may not have all the answers, please know that your feelings matter. Is there something specific about your wellness I can help with?",
    "Thank you for sharing with me! 🌸 Remember, you're not alone in this journey. How else can I support you today?",
  ],
};

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 💕 I'm your FEMCARE wellness companion. I'm here to support you with care and understanding. How are you feeling today? 🌸",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [distressMessage, setDistressMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectDistress = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return DISTRESS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      return BOT_RESPONSES.greeting[Math.floor(Math.random() * BOT_RESPONSES.greeting.length)];
    }
    if (lowerText.includes("period") || lowerText.includes("menstrual")) {
      return BOT_RESPONSES.period[Math.floor(Math.random() * BOT_RESPONSES.period.length)];
    }
    if (lowerText.includes("cramp") || lowerText.includes("pain") || lowerText.includes("hurt")) {
      return BOT_RESPONSES.cramps[Math.floor(Math.random() * BOT_RESPONSES.cramps.length)];
    }
    if (lowerText.includes("mood") || lowerText.includes("sad") || lowerText.includes("angry") || lowerText.includes("emotional")) {
      return BOT_RESPONSES.mood[Math.floor(Math.random() * BOT_RESPONSES.mood.length)];
    }
    
    return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);

    // Check for distress
    if (detectDistress(input)) {
      setDistressMessage(input);
      setShowEmailPrompt(true);
      
      const alertMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "💕 I'm really concerned about what you're sharing. You matter so much, and you don't have to go through this alone. Would you like to reach out to someone who cares about you? I can help you send a message to your guardian. Please remember: you are loved, you are important, and there is help available. 🤗",
        isBot: true,
        isAlert: true,
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, alertMessage]);
      }, 500);
    } else {
      const botResponse = getBotResponse(input);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isBot: true,
        }]);
      }, 800);
    }

    setInput("");
  };

  const handleEmailGuardian = () => {
    const subject = encodeURIComponent("Concern from FEMCARE - Please Check In");
    const body = encodeURIComponent(
      `Dear Guardian,\n\nThis message is being sent from FEMCARE wellness platform.\n\nThe user shared the following message that indicated they may need support:\n\n"${distressMessage}"\n\nPlease check in with them and provide support.\n\nWith care,\nFEMCARE Wellness Platform`
    );
    
    window.location.href = `mailto:${GUARDIAN_EMAIL}?subject=${subject}&body=${body}`;
    setShowEmailPrompt(false);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "💕 Your email app should open now. Remember, reaching out is a sign of strength. You're brave and you're loved. I'm always here if you want to talk more. 🌸",
      isBot: true,
    }]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary/30" />
            Your Wellness Companion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-accent/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                    message.isBot
                      ? message.isAlert
                        ? "bg-destructive/10 border-2 border-destructive/30 text-foreground"
                        : "bg-card border border-border text-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.isAlert && (
                    <AlertTriangle className="h-4 w-4 text-destructive mb-2" />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Email Prompt */}
          {showEmailPrompt && (
            <div className="p-4 bg-accent/50 border-t border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Would you like to reach out to your guardian?
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEmailGuardian} className="flex-1">
                  Yes, Send Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmailPrompt(false)}
                  className="flex-1"
                >
                  Not Now
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Share how you're feeling..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card className="mt-4 border-primary/20 bg-accent/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💕 Remember: You are never alone. If you're in crisis, please reach out to a trusted adult or call a helpline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
