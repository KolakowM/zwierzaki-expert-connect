import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/services/blogService";

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/blog" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Powrót do bloga
          </Link>
        </Button>
      </div>

      {post.featured_image && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.published_at && (
              <span>
                {format(new Date(post.published_at), "d MMMM yyyy", { locale: pl })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views_count} wyświetleń</span>
          </div>
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none dark:prose-invert
          prose-headings:text-foreground
          prose-p:text-muted-foreground
          prose-a:text-primary hover:prose-a:text-primary/80
          prose-strong:text-foreground
          prose-ul:text-muted-foreground
          prose-ol:text-muted-foreground
          prose-blockquote:border-primary prose-blockquote:text-muted-foreground
          prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default BlogPostContent;
