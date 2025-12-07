import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import type { BlogPost } from "@/services/blogService";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {post.featured_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold line-clamp-2 text-foreground">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.published_at && (
                <span>
                  {format(new Date(post.published_at), "d MMM yyyy", { locale: pl })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.views_count}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
