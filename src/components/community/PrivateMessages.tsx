import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader2, ArrowLeft, Stethoscope, Brain, Shield } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: string | null;
  isVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface PrivateMessagesProps {
  user: User;
}

export function PrivateMessages({ user }: PrivateMessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [user.id]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data: allMessages, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Message[]>();
      
      (allMessages || []).forEach((msg) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)!.push(msg);
      });

      // Get partner details for each conversation
      const conversationsList: Conversation[] = await Promise.all(
        Array.from(conversationMap.entries()).map(async ([partnerId, msgs]) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', partnerId)
            .single();

          const { data: roles } = await supabase
            .from('user_roles')
            .select('role, is_verified')
            .eq('user_id', partnerId);

          const unreadCount = msgs.filter(
            (m) => m.receiver_id === user.id && !m.is_read
          ).length;

          const role = roles?.[0];

          return {
            partnerId,
            partnerName: profile?.display_name || 'Community Member',
            partnerRole: role?.role || null,
            isVerified: role?.is_verified || false,
            lastMessage: msgs[0].content.substring(0, 50) + (msgs[0].content.length > 50 ? '...' : ''),
            lastMessageTime: msgs[0].created_at,
            unreadCount,
          };
        })
      );

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      const unreadIds = (data || [])
        .filter((m) => m.receiver_id === user.id && !m.is_read)
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('private_messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    try {
      const { error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedConversation);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getRoleBadge = (role: string | null, isVerified: boolean) => {
    if (!role || !isVerified) return null;

    if (role === 'doctor') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 gap-1 text-xs">
          <Stethoscope className="h-3 w-3" />
          Doctor
        </Badge>
      );
    }
    if (role === 'psychiatrist') {
      return (
        <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 gap-1 text-xs">
          <Brain className="h-3 w-3" />
          Psychiatrist
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  // Conversation list view
  if (!selectedConversation) {
    if (conversations.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Start a conversation with a verified professional from the Experts tab.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Conversations</h2>
        
        {conversations.map((conv) => (
          <Card
            key={conv.partnerId}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedConversation(conv.partnerId)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{conv.partnerName}</CardTitle>
                  {getRoleBadge(conv.partnerRole, conv.isVerified)}
                </div>
                {conv.unreadCount > 0 && (
                  <Badge variant="default">{conv.unreadCount} new</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Message thread view
  const currentConversation = conversations.find((c) => c.partnerId === selectedConversation);

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {currentConversation?.partnerName}
              </CardTitle>
              {getRoleBadge(currentConversation?.partnerRole || null, currentConversation?.isVerified || false)}
            </div>
            <CardDescription>Private conversation</CardDescription>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender_id === user.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
