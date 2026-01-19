import { useState, useRef, useEffect } from "react";
import { Send, Heart, AlertTriangle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isAlert?: boolean;
  isDistress?: boolean;
}

const DISTRESS_KEYWORDS = [
  "want to die", "kill myself", "suicide", "end my life",
  "hopeless", "can't handle", "give up", "worthless",
  "hurt myself", "self harm", "no point", "better off dead",
  "don't want to live", "want to commit suicide", "feel like killing",
  "tired of life", "end it all", "no reason to live", "want to disappear",
  "i hate myself", "nobody cares", "i'm a burden", "can't take it anymore"
];

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

const CRISIS_RESPONSE = `💕 I hear you, and I'm really concerned about what you're sharing. Please know that you matter so much, and you don't have to go through this alone.

🆘 **Immediate Help Available:**
• **iCall**: 9152987821
• **Vandrevala Foundation**: 1860-2662-345
• **NIMHANS**: 080-46110007

I've notified someone who cares about you. Please reach out to a trusted adult, friend, or call a helpline right now. You are loved, you are important, and there IS help available. 💗

Would you like to talk about what's making you feel this way? I'm here to listen without judgment. 🤗`;

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 💕 I'm your FEMCARE wellness companion. I'm here to support you with care and understanding. How are you feeling today? 🌸",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const sendGuardianEmail = async (userMessage: string) => {
    try {
      console.log("Automatically sending guardian email for distress message...");
      
      const { data, error } = await supabase.functions.invoke('send-guardian-email', {
        body: {
          userMessage,
          timestamp: new Date().toLocaleString(),
        },
      });

      if (error) {
        console.error("Error sending guardian email:", error);
        return false;
      }

      console.log("Guardian email sent successfully:", data);
      return true;
    } catch (err) {
      console.error("Failed to send guardian email:", err);
      return false;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const isDistressMessage = detectDistress(input);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      isDistress: isDistressMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    if (isDistressMessage) {
      setIsSending(true);
      
      // Automatically send email to guardian without asking
      const emailSent = await sendGuardianEmail(currentInput);
      
      const alertMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: CRISIS_RESPONSE,
        isBot: true,
        isAlert: true,
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, alertMessage]);
        setIsSending(false);
        if (emailSent) {
          toast.success("Your guardian has been notified 💕", {
            description: "Someone who cares about you will reach out soon."
          });
        }
      }, 500);
    } else {
      const botResponse = getBotResponse(currentInput);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isBot: true,
        }]);
      }, 800);
    }
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
                  message.isBot ? "justify-start" : message.isDistress ? "justify-center" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                    message.isBot
                      ? message.isAlert
                        ? "bg-rose-50 border-2 border-rose-200 text-foreground"
                        : "bg-card border border-border text-foreground"
                      : message.isDistress
                        ? "bg-rose-100 border-2 border-rose-300 text-foreground"
                        : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.isAlert && (
                    <div className="flex items-center gap-2 text-rose-600 mb-3">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">We're Here For You</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Share how you're feeling..."
                className="flex-1"
                disabled={isSending}
              />
              <Button onClick={handleSend} size="icon" disabled={isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Support Info */}
      <Card className="mt-4 border-primary/20 bg-gradient-to-r from-accent/20 to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 justify-center">
            <Phone className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              💕 In crisis? Call <strong>iCall: 9152987821</strong> or <strong>Vandrevala: 1860-2662-345</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
