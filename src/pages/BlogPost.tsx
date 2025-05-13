
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogPost as BlogPostType } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthProvider";
import BlogPostSkeleton from "@/components/blog/BlogPostSkeleton";

const BlogPost = () => {
  const { id } = useParams<{id: string}>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (postId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      setPost(data as BlogPostType);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Błąd pobierania artykułu",
        description: error.message,
        variant: "destructive"
      });
      navigate("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <BlogPostSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold">Artykuł nie został znaleziony</h1>
            <p className="mt-4 text-muted-foreground">Artykuł o podanym ID nie istnieje lub został usunięty.</p>
            <Button onClick={() => navigate("/blog")} className="mt-6">
              <ChevronLeft className="mr-2 h-4 w-4" /> Wróć do bloga
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/blog")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Wróć do wszystkich artykułów
          </Button>
          
          {isAdmin() && (
            <Button variant="outline" onClick={() => navigate(`/blog/edit/${post.id}`)}>
              <Edit className="mr-2 h-4 w-4" /> Edytuj artykuł
            </Button>
          )}
        </div>
        
        <Card className="overflow-hidden">
          {post.image_url && (
            <div className="relative h-64 w-full md:h-96">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="h-full w-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
            
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <span>Opublikowano: {format(new Date(post.created_at), 'dd.MM.yyyy')}</span>
              {post.updated_at && post.updated_at !== post.created_at && (
                <span className="ml-4">
                  Zaktualizowano: {format(new Date(post.updated_at), 'dd.MM.yyyy')}
                </span>
              )}
            </div>
            
            {post.summary && (
              <div className="mt-6 text-lg font-medium italic text-muted-foreground">
                {post.summary}
              </div>
            )}
            
            <div 
              className="prose prose-slate mt-8 max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BlogPost;
