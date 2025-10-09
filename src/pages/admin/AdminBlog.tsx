import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { BlogPostTable } from "@/components/admin/blog/BlogPostTable";
import { BlogPostFormDialog } from "@/components/admin/blog/BlogPostFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import { BlogPost, BlogPostFormData } from "@/types/blog";
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

export default function AdminBlog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, verifySession } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();
  const [postToDelete, setPostToDelete] = useState<BlogPost | undefined>();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifySession();
      if (!isValid) {
        navigate("/login");
        return;
      }
      
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        navigate("/dashboard");
        return;
      }
      
      setAuthChecked(true);
    };
    checkAuth();
  }, [verifySession, isAdmin, navigate]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("blog_posts").insert({
        ...data,
        author_id: user.id,
        published_at: data.status === 'published' ? (data.published_at || new Date()).toISOString() : null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Artykuł utworzony", description: "Artykuł został pomyślnie utworzony." });
      setFormOpen(false);
      setSelectedPost(undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się utworzyć artykułu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogPostFormData }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          ...data,
          published_at: data.status === 'published' ? (data.published_at || new Date()).toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Artykuł zaktualizowany", description: "Zmiany zostały zapisane." });
      setFormOpen(false);
      setSelectedPost(undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się zaktualizować artykułu.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Artykuł usunięty", description: "Artykuł został pomyślnie usunięty." });
      setDeleteDialogOpen(false);
      setPostToDelete(undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się usunąć artykułu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: BlogPostFormData) => {
    if (selectedPost) {
      updateMutation.mutate({ id: selectedPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleView = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`);
  };

  const handleCreate = () => {
    setSelectedPost(undefined);
    setFormOpen(true);
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Sprawdzanie uprawnień...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Blog</h1>
            <p className="text-sm text-muted-foreground">Zarządzaj artykułami na blogu</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nowy artykuł
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">

          {isLoading ? (
            <div className="text-center py-12">Ładowanie...</div>
          ) : (
            <BlogPostTable
              posts={posts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}

          <BlogPostFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            post={selectedPost}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć ten artykuł?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest nieodwracalna. Artykuł "{postToDelete?.title}" zostanie trwale usunięty.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => postToDelete && deleteMutation.mutate(postToDelete.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
