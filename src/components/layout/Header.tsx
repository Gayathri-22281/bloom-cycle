import { Link, useLocation } from "react-router-dom";
import { Calendar, Dumbbell, Package, MessageCircle, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import femcareLogo from "@/assets/femcare-logo.png";

const navItems = [
  { path: "/", label: "Home", icon: null },
  { path: "/tracker", label: "Period Tracker", icon: Calendar },
  { path: "/exercises", label: "Self-Care", icon: Dumbbell },
  { path: "/stock", label: "Stock Reminder", icon: Package },
  { path: "/chatbot", label: "Support", icon: MessageCircle },
  { path: "/tutorials", label: "Tutorials", icon: BookOpen },
  { path: "/clinics", label: "Find Clinics", icon: MapPin },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={femcareLogo} 
            alt="FEMCARE Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 transition-all duration-200",
                    isActive && "shadow-md"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const location = useLocation();
  
  return (
    <div className="flex items-center gap-2">
      {navItems.slice(1, 5).map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
            >
              {Icon && <Icon className="h-4 w-4" />}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
