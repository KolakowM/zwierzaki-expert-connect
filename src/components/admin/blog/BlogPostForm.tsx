import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { BlogImageUpload } from "./BlogImageUpload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPost, BlogPostFormData } from "@/types/blog";

const formSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany").max(200, "Tytuł może mieć maksymalnie 200 znaków"),
  slug: z.string()
    .min(1, "Slug jest wymagany")
    .max(200, "Slug może mieć maksymalnie 200 znaków")
    .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  content: z.string().min(1, "Treść jest wymagana"),
  excerpt: z.string().max(500, "Excerpt może mieć maksymalnie 500 znaków").optional(),
  featured_image: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.date().optional(),
  meta_description: z.string().max(160, "Meta opis może mieć maksymalnie 160 znaków").optional(),
});

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (data: BlogPostFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogPostForm({ post, onSubmit, onCancel, isLoading }: BlogPostFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      featured_image: post?.featured_image || "",
      status: post?.status || "draft",
      published_at: post?.published_at ? new Date(post.published_at) : undefined,
      meta_description: post?.meta_description || "",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź|ż/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!post) {
      form.setValue('slug', generateSlug(title));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Wprowadź tytuł artykułu"
                  {...field}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
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
              <FormLabel>Slug (URL) *</FormLabel>
              <FormControl>
                <Input placeholder="slug-artykulu" {...field} />
              </FormControl>
              <FormDescription>
                Używany w adresie URL artykułu. Tylko małe litery, cyfry i myślniki.
              </FormDescription>
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
                  placeholder="Krótkie podsumowanie artykułu (wyświetlane na liście)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Maksymalnie 500 znaków</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treść artykułu *</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Wprowadź treść artykułu..."
                  className="min-h-[400px]"
                />
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
              <FormControl>
                <BlogImageUpload
                  value={field.value}
                  onChange={field.onChange}
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
                  placeholder="Opis dla wyszukiwarek internetowych"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Maksymalnie 160 znaków</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Szkic</SelectItem>
                  <SelectItem value="published">Opublikowany</SelectItem>
                  <SelectItem value="archived">Zarchiwizowany</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Zapisywanie..." : post ? "Zapisz zmiany" : "Utwórz artykuł"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
