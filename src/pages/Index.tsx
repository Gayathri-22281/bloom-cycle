import { Link } from "react-router-dom";
import { Heart, Calendar, Dumbbell, Package, MessageCircle, BookOpen, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import patternBg from "@/assets/pattern-bg.jpg";

const features = [
  {
    icon: Calendar,
    title: "Period Tracker",
    description: "Track your cycle with our beautiful calendar. Get predictions and health insights.",
    path: "/tracker",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Dumbbell,
    title: "Self-Care Exercises",
    description: "Gentle yoga and stretches tailored for each phase of your cycle.",
    path: "/exercises",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Package,
    title: "Stock Reminder",
    description: "Never run out! Get reminders to restock your menstrual essentials.",
    path: "/stock",
    color: "from-rose-400 to-orange-400",
  },
  {
    icon: MessageCircle,
    title: "Wellness Support",
    description: "Chat with our caring companion for emotional support and guidance.",
    path: "/chatbot",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: BookOpen,
    title: "Tutorials",
    description: "Learn everything about menstrual health with our step-by-step guides.",
    path: "/tutorials",
    color: "from-teal-400 to-emerald-500",
  },
  {
    icon: MapPin,
    title: "Find Clinics",
    description: "Locate nearby gynecologists and women's health clinics.",
    path: "/clinics",
    color: "from-blue-400 to-cyan-500",
  },
];

const Index = () => {
  return (
    <Layout showPattern>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${patternBg})`,
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/20 to-background" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your wellness journey starts here</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Embrace Your Cycle with
              <span className="text-primary block mt-2">Care & Confidence</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              FEMCARE is your compassionate companion for menstrual wellness. Track your cycle, find comfort, and take care of yourself — because you deserve it. 💕
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tracker">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Calendar className="h-5 w-5" />
                  Start Tracking
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <Heart className="h-5 w-5" />
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/30 blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need 🌸
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools designed with love to support every aspect of your menstrual wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.path} to={feature.path}>
                <Card className="group h-full border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-accent/20 to-primary/5">
          <CardContent className="p-8 md:p-12 text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4 fill-primary/20" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              You're Not Alone in This Journey
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Whether you need someone to talk to or just want to learn more about your body, we're here for you. 💕
            </p>
            <Link to="/chatbot">
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with Our Wellness Companion
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Index;
