import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Heart, Shield } from "lucide-react";

interface CreatePostProps {
  user: User;
}

const categories = [
  { value: 'general', label: 'General Discussion' },
  { value: 'period-pain', label: 'Period Pain & Symptoms' },
  { value: 'mental-health', label: 'Mental Health & Emotions' },
  { value: 'support', label: 'Seeking Support' },
  { value: 'tips', label: 'Tips & Advice' },
];

export function CreatePost({ user }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      toast.success("Your post has been shared with the community!");
      setTitle("");
      setContent("");
      setCategory("general");
      setIsAnonymous(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Your story can help others feel less alone. Share openly and receive support.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your post a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Story</Label>
            <Textarea
              id="content"
              placeholder="Share what you're going through, how you're feeling, or what support you need..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[150px]"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/5000 characters
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Post Anonymously
                </Label>
                <p className="text-xs text-muted-foreground">
                  Your name won't be shown with this post
                </p>
              </div>
            </div>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Share with Community
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
