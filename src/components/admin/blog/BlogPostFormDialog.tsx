import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { BlogPostForm } from "./BlogPostForm";

interface BlogPostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost;
  onSubmit: (data: BlogPostFormData) => void;
  isLoading?: boolean;
}

export function BlogPostFormDialog({
  open,
  onOpenChange,
  post,
  onSubmit,
  isLoading,
}: BlogPostFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Edytuj artykuł" : "Nowy artykuł"}
          </DialogTitle>
        </DialogHeader>
        <BlogPostForm
          post={post}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
