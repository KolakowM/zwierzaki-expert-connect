import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Plus, Pencil, Trash2, Eye, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getAllPosts, deletePost } from "@/services/blogService";

const AdminBlog = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: getAllPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Artykuł został usunięty");
    },
    onError: () => {
      toast.error("Nie udało się usunąć artykułu");
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Zarządzanie blogiem</h1>
            <p className="text-muted-foreground">Twórz i edytuj artykuły na blogu</p>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Nowy artykuł
            </Link>
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data publikacji</TableHead>
                <TableHead className="text-center">Wyświetlenia</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Ładowanie...
                  </TableCell>
                </TableRow>
              ) : posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Brak artykułów. Utwórz pierwszy artykuł!
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Opublikowany" : "Szkic"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.published_at
                        ? format(new Date(post.published_at), "d MMM yyyy", { locale: pl })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {post.views_count}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === "published" && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/blog/${post.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Usuń artykuł</AlertDialogTitle>
                              <AlertDialogDescription>
                                Czy na pewno chcesz usunąć artykuł "{post.title}"? Tej operacji nie można cofnąć.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anuluj</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Usuń
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
