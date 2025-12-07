import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostBySlug, incrementViewCount } from "@/services/blogService";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (post?.id) {
      incrementViewCount(post.id).catch(console.error);
    }
  }, [post?.id]);

  useEffect(() => {
    if (error) {
      navigate("/blog", { replace: true });
    }
  }, [error, navigate]);

  return (
    <MainLayout>
      {post && (
        <Helmet>
          <title>{post.title} | Blog PetsFlow</title>
          <meta name="description" content={post.meta_description || post.excerpt || ""} />
          {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        </Helmet>
      )}

      <div className="container py-12">
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : post ? (
          <BlogPostContent post={post} />
        ) : null}
      </div>
    </MainLayout>
  );
};

export default BlogPost;
