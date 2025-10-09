import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogSettings } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Blog() {
  const [page, setPage] = useState(1);

  const { data: settings } = useQuery({
    queryKey: ["blog-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as BlogSettings;
    },
  });

  const postsPerPage = settings?.posts_per_page || 9;

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["blog-posts", page, postsPerPage],
    queryFn: async () => {
      const from = (page - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      const { data, error, count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { posts: data as BlogPost[], total: count || 0 };
    },
  });

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog PetsFlow</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Porady, ciekawostki i informacje o zdrowiu i opiece nad zwierzętami
            </p>
          </header>

          {isLoading ? (
            <div className="text-center py-12">Ładowanie artykułów...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Brak opublikowanych artykułów
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Poprzednia
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Strona {page} z {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Następna
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
