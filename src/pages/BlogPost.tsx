import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as BlogPostType } from "@/types/blog";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .single();

      if (error) throw error;
      return data as BlogPostType;
    },
    enabled: !!slug,
  });

  const incrementViewsMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({ views_count: post!.views_count + 1 })
        .eq("id", postId);
      if (error) throw error;
    },
  });

  useEffect(() => {
    if (post) {
      incrementViewsMutation.mutate(post.id);
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">Ładowanie artykułu...</div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Artykuł nie został znaleziony</h1>
            <p className="text-muted-foreground mb-8">
              Przepraszamy, ale artykuł, którego szukasz, nie istnieje.
            </p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do bloga
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>{post.title} - Blog PetsFlow</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || post.title} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do bloga
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.published_at), "d MMMM yyyy", { locale: pl })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.views_count} wyświetleń
              </div>
            </div>

            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-lg mb-8"
              />
            )}
          </header>

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </MainLayout>
  );
}
