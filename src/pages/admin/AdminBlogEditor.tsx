import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArrowLeft, Save, Send } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { getPostById, createPost, updatePost, generateSlug } from "@/services/blogService";
import { useAuth } from "@/contexts/AuthProvider";

const postSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  slug: z.string().min(1, "Slug jest wymagany"),
  content: z.string().min(1, "Treść jest wymagana"),
  excerpt: z.string().optional(),
  featured_image: z.string().url("Nieprawidłowy URL obrazu").optional().or(z.literal("")),
  meta_description: z.string().max(160, "Maksymalnie 160 znaków").optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

const AdminBlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!id;

  const { data: post, isLoading } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: () => getPostById(id!),
    enabled: isEditing,
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: "",
      meta_description: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        featured_image: post.featured_image || "",
        meta_description: post.meta_description || "",
      });
    }
  }, [post, form]);

  const title = form.watch("title");
  useEffect(() => {
    if (!isEditing && title) {
      form.setValue("slug", generateSlug(title));
    }
  }, [title, isEditing, form]);

  const createMutation = useMutation({
    mutationFn: (data: { values: PostFormValues; status: string }) =>
      createPost({
        ...data.values,
        author_id: user?.id,
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Artykuł został utworzony");
      navigate("/admin/blog");
    },
    onError: () => {
      toast.error("Nie udało się utworzyć artykułu");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { values: PostFormValues; status: string }) =>
      updatePost(id!, {
        ...data.values,
        status: data.status,
        published_at:
          data.status === "published" && post?.status !== "published"
            ? new Date().toISOString()
            : post?.published_at,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-post", id] });
      toast.success("Artykuł został zaktualizowany");
      navigate("/admin/blog");
    },
    onError: () => {
      toast.error("Nie udało się zaktualizować artykułu");
    },
  });

  const onSubmit = (values: PostFormValues, status: string) => {
    if (isEditing) {
      updateMutation.mutate({ values, status });
    } else {
      createMutation.mutate({ values, status });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">Ładowanie...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edytuj artykuł" : "Nowy artykuł"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Zaktualizuj treść artykułu" : "Utwórz nowy wpis na blogu"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz tytuł artykułu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="url-artykulu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obrazek wyróżniający (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Krótki opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Krótki opis artykułu widoczny na liście..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta opis (SEO)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Opis dla wyszukiwarek (max 160 znaków)..."
                      rows={2}
                      maxLength={160}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/160 znaków
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treść artykułu</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-background"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["blockquote", "link", "image"],
                          ["clean"],
                        ],
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={form.handleSubmit((values) => onSubmit(values, "draft"))}
              >
                <Save className="h-4 w-4 mr-2" />
                Zapisz jako szkic
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={form.handleSubmit((values) => onSubmit(values, "published"))}
              >
                <Send className="h-4 w-4 mr-2" />
                {isEditing && post?.status === "published" ? "Zaktualizuj" : "Opublikuj"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;
