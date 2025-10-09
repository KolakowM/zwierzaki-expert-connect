import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blog/${post.slug}`}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Brak zdjęcia</span>
          </div>
        )}
      </Link>

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          {post.published_at && format(new Date(post.published_at), "d MMMM yyyy", { locale: pl })}
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          {post.views_count} wyświetleń
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="text-primary hover:underline text-sm font-medium"
        >
          Czytaj więcej →
        </Link>
      </CardFooter>
    </Card>
  );
}
