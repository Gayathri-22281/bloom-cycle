import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Brain, MessageCircle, Shield, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Professional {
  user_id: string;
  role: string;
  is_verified: boolean;
  profiles: {
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
}

interface ProfessionalsListProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function ProfessionalsList({ user, onAuthRequired }: ProfessionalsListProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; professional: Professional | null }>({
    open: false,
    professional: null,
  });
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('user_id, role, is_verified')
        .in('role', ['doctor', 'psychiatrist'])
        .eq('is_verified', true);

      if (error) throw error;

      // Fetch profiles for each professional
      const professionalsWithProfiles = await Promise.all(
        (roles || []).map(async (role) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, bio, avatar_url')
            .eq('user_id', role.user_id)
            .single();

          return {
            ...role,
            profiles: profile || { display_name: null, bio: null, avatar_url: null },
          };
        })
      );

      setProfessionals(professionalsWithProfiles);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!messageContent.trim() || !messageDialog.professional) return;

    setSending(true);

    try {
      const { error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: messageDialog.professional.user_id,
          content: messageContent.trim(),
        });

      if (error) throw error;

      toast.success("Message sent successfully!");
      setMessageDialog({ open: false, professional: null });
      setMessageContent("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'doctor') {
      return <Stethoscope className="h-5 w-5 text-emerald-500" />;
    }
    return <Brain className="h-5 w-5 text-purple-500" />;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'doctor') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 gap-1">
          <Shield className="h-3 w-3" />
          Verified Doctor
        </Badge>
      );
    }
    return (
      <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 gap-1">
        <Shield className="h-3 w-3" />
        Verified Psychiatrist
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted" />
            <CardContent className="h-16 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Verified Professionals Yet</h3>
          <p className="text-muted-foreground">
            Our team is working on verifying healthcare professionals. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Verified Healthcare Professionals</h2>
        <p className="text-muted-foreground">
          Connect privately with verified doctors and mental health experts for professional guidance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {professionals.map((professional) => (
          <Card key={professional.user_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10">
                    {getRoleIcon(professional.role)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">
                      {professional.profiles.display_name || 'Healthcare Professional'}
                    </CardTitle>
                  </div>
                  {getRoleBadge(professional.role)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription className="mb-4">
                {professional.profiles.bio || 'Available to provide professional guidance and support.'}
              </CardDescription>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => {
                  if (!user) {
                    onAuthRequired();
                    return;
                  }
                  setMessageDialog({ open: true, professional });
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Send Private Message
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, professional: messageDialog.professional })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Message {messageDialog.professional?.profiles.display_name || 'Professional'}
            </DialogTitle>
            <DialogDescription>
              Send a private message to receive professional guidance. Your conversation is confidential.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Describe your concern or question..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {messageContent.length}/2000 characters
            </p>

            <Button
              onClick={handleSendMessage}
              disabled={!messageContent.trim() || sending}
              className="w-full"
            >
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
