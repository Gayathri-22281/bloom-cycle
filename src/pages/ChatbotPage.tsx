import { MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ChatBot } from "@/components/chatbot/ChatBot";

export default function ChatbotPage() {
  return (
    <Layout showPattern>
      <div className="container py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Wellness Support 💬
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            I'm here to listen and support you. Share how you're feeling — you're not alone. 💕
          </p>
        </div>

        <ChatBot />
      </div>
    </Layout>
  );
}
