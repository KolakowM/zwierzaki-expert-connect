import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedPosts, getBlogSettings } from "@/services/blogService";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: settings } = useQuery({
    queryKey: ["blog-settings"],
    queryFn: getBlogSettings,
  });

  const postsPerPage = settings?.posts_per_page || 9;

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", currentPage, postsPerPage],
    queryFn: () => getPublishedPosts(currentPage, postsPerPage),
  });

  const totalPages = data ? Math.ceil(data.total / postsPerPage) : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <MainLayout>
      <Helmet>
        <title>Blog | PetsFlow</title>
        <meta name="description" content="Artykuły i porady dla opiekunów zwierząt. Dowiedz się więcej o zdrowiu, pielęgnacji i zachowaniu Twojego pupila." />
      </Helmet>

      <div className="container py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Artykuły i porady dla opiekunów zwierząt
          </p>
        </header>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : data?.posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Brak artykułów do wyświetlenia
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Blog;
