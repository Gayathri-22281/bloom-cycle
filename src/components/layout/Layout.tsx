import { Header } from "./Header";
import patternBg from "@/assets/pattern-bg.jpg";

interface LayoutProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

export function Layout({ children, showPattern = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showPattern && (
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: `url(${patternBg})`,
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
          }}
        />
      )}
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <footer className="relative z-10 border-t border-border/40 bg-card/50 py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            💕 FEMCARE - Supporting women's health with care and compassion
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Your wellness journey matters to us
          </p>
        </div>
      </footer>
    </div>
  );
}
