import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CreatePost } from "@/components/community/CreatePost";
import { PrivateMessages } from "@/components/community/PrivateMessages";
import { ProfessionalsList } from "@/components/community/ProfessionalsList";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Heart, MessageCircle, Users, Shield, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            🌸 FemCare Community Support
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A safe, open space to share your experiences, receive emotional support, 
            and connect with verified doctors and mental health professionals.
          </p>
        </div>

        {/* Auth Section */}
        <div className="flex justify-center gap-4 mb-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Signed in as {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthDialog(true)}>
              Join the Community
            </Button>
          )}
        </div>

        {/* Community Guidelines */}
        <div className="bg-secondary/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Community Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                This is a supportive space. Be kind, respectful, and non-judgmental. 
                You can post anonymously if you prefer. Professional responses are 
                clearly marked with verification badges.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="feed" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="post" className="gap-2" disabled={!user}>
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </TabsTrigger>
            <TabsTrigger value="professionals" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Experts</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2" disabled={!user}>
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <CommunityFeed user={user} onAuthRequired={() => setShowAuthDialog(true)} />
          </TabsContent>

          <TabsContent value="post">
            {user ? (
              <CreatePost user={user} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Please sign in to share your experience
                </p>
                <Button onClick={() => setShowAuthDialog(true)}>
                  Sign In to Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="professionals">
            <ProfessionalsList user={user} onAuthRequired={() => setShowAuthDialog(true)} />
          </TabsContent>

          <TabsContent value="messages">
            {user ? (
              <PrivateMessages user={user} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Please sign in to view your messages
                </p>
                <Button onClick={() => setShowAuthDialog(true)}>
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    </Layout>
  );
}
