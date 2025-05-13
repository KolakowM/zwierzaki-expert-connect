
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthProvider";
import BlogPostList from "@/components/blog/BlogPostList";
import BlogHeader from "@/components/blog/BlogHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Błąd pobierania artykułów",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <BlogHeader />
        
        {isAdmin() && (
          <div className="mb-8 flex justify-end">
            <Button onClick={() => navigate("/blog/new")}>
              Dodaj nowy artykuł
            </Button>
          </div>
        )}
        
        <BlogPostList 
          posts={posts} 
          isLoading={isLoading} 
          isAdmin={isAdmin()} 
          onRefresh={fetchBlogPosts}
        />
      </div>
    </MainLayout>
  );
};

export default Blog;
