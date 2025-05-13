
import { BlogPost } from "@/types/blog"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BlogPostSkeleton from "./BlogPostSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogPostListProps {
  posts: BlogPost[];
  isLoading: boolean;
  isAdmin: boolean;
  onRefresh: () => void;
}

const BlogPostList = ({ posts, isLoading, isAdmin, onRefresh }: BlogPostListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Delete post from database
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete.id);
        
      if (error) throw error;
      
      // If there's an image, delete it from storage
      if (postToDelete.image_url) {
        const imageUrlParts = postToDelete.image_url.split('/');
        const imageName = imageUrlParts[imageUrlParts.length - 1];
        const filePath = `blog-images/${imageName}`;
        
        const { error: storageError } = await supabase.storage
          .from('public')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Error deleting image:', storageError);
        }
      }
      
      toast({
        title: "Artykuł usunięty",
        description: "Artykuł został pomyślnie usunięty."
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Błąd usuwania artykułu",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <BlogPostSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold">Brak artykułów</h2>
        <p className="mt-4 text-muted-foreground">
          {isAdmin 
            ? "Dodaj pierwszy artykuł, aby rozpocząć blog." 
            : "W tej chwili nie ma opublikowanych artykułów."}
        </p>
        {isAdmin && (
          <Button onClick={() => navigate("/blog/new")} className="mt-6">
            Dodaj pierwszy artykuł
          </Button>
        )}
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            {post.image_url && (
              <div 
                className="h-48 w-full cursor-pointer" 
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105" 
                />
              </div>
            )}
            
            <CardHeader className="flex-grow">
              <CardTitle 
                className="cursor-pointer hover:text-primary"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {post.title}
              </CardTitle>
              <CardDescription>
                {format(new Date(post.created_at), 'dd.MM.yyyy')}
              </CardDescription>
              
              {post.summary && (
                <p className="mt-2 text-muted-foreground line-clamp-3">
                  {post.summary}
                </p>
              )}
            </CardHeader>
            
            <CardFooter className="pt-0 pb-4 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                Czytaj więcej
              </Button>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate(`/blog/edit/${post.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(post)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten artykuł?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta operacja jest nieodwracalna. Artykuł zostanie trwale usunięty z systemu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogPostList;
