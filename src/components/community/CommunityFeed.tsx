import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Heart, Shield, Stethoscope, Brain, Send, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  category: string;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  user_roles?: {
    role: string;
    is_verified: boolean;
  }[];
  community_comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string | null;
  };
  user_roles?: {
    role: string;
    is_verified: boolean;
  }[];
}

interface CommunityFeedProps {
  user: User | null;
  onAuthRequired: () => void;
}

export function CommunityFeed({ user, onAuthRequired }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('community_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch related data for each post
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', post.user_id)
            .single();

          // Get user role
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role, is_verified')
            .eq('user_id', post.user_id);

          // Get comments
          const { data: comments } = await supabase
            .from('community_comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          // Get comment authors' details
          const commentsWithDetails = await Promise.all(
            (comments || []).map(async (comment) => {
              const { data: commentProfile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('user_id', comment.user_id)
                .single();

              const { data: commentRoles } = await supabase
                .from('user_roles')
                .select('role, is_verified')
                .eq('user_id', comment.user_id);

              return {
                ...comment,
                profiles: commentProfile,
                user_roles: commentRoles,
              };
            })
          );

          return {
            ...post,
            profiles: profile,
            user_roles: roles,
            community_comments: commentsWithDetails,
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    const content = commentText[postId]?.trim();
    if (!content) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: false,
        });

      if (error) throw error;

      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      toast.success('Comment posted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post comment');
    }
  };

  const getRoleBadge = (roles: { role: string; is_verified: boolean }[] | undefined) => {
    if (!roles || roles.length === 0) return null;
    
    const role = roles[0];
    if (role.role === 'doctor' && role.is_verified) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 gap-1">
          <Stethoscope className="h-3 w-3" />
          Verified Doctor
        </Badge>
      );
    }
    if (role.role === 'psychiatrist' && role.is_verified) {
      return (
        <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 gap-1">
          <Brain className="h-3 w-3" />
          Verified Psychiatrist
        </Badge>
      );
    }
    return null;
  };

  const getAuthorName = (post: Post) => {
    if (post.is_anonymous) return 'Anonymous';
    return post.profiles?.display_name || 'Community Member';
  };

  const getCommentAuthorName = (comment: Comment) => {
    if (comment.is_anonymous) return 'Anonymous';
    return comment.profiles?.display_name || 'Community Member';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'period-pain':
        return 'bg-rose-500/20 text-rose-600';
      case 'mental-health':
        return 'bg-purple-500/20 text-purple-600';
      case 'support':
        return 'bg-blue-500/20 text-blue-600';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted" />
            <CardContent className="h-24 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No posts yet. Be the first to share your experience!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.is_anonymous ? '?' : <UserIcon className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getAuthorName(post)}</span>
                    {getRoleBadge(post.user_roles)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Badge className={getCategoryColor(post.category)}>
                {post.category.replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
          </CardContent>

          <CardFooter className="flex-col items-stretch border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="self-start gap-2 mb-3"
              onClick={() => {
                setExpandedPosts((prev) => {
                  const next = new Set(prev);
                  if (next.has(post.id)) {
                    next.delete(post.id);
                  } else {
                    next.add(post.id);
                  }
                  return next;
                });
              }}
            >
              <MessageCircle className="h-4 w-4" />
              {post.community_comments?.length || 0} Comments
            </Button>

            {expandedPosts.has(post.id) && (
              <div className="space-y-4 w-full">
                {/* Comments list */}
                {post.community_comments && post.community_comments.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {post.community_comments.map((comment) => (
                      <div key={comment.id} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {getCommentAuthorName(comment)}
                          </span>
                          {getRoleBadge(comment.user_roles)}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder={user ? "Share your thoughts or support..." : "Sign in to comment"}
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    disabled={!user}
                    className="min-h-[60px]"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleComment(post.id)}
                    disabled={!user || !commentText[post.id]?.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
