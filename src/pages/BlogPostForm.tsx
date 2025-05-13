
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChevronLeft, Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate as useNavigate2 } from "react-router-dom";

const BlogPostForm = () => {
  const { id } = useParams<{id: string}>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<{
    title: string;
    summary: string;
  }>();

  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Brak dostępu",
        description: "Tylko administrator może edytować artykuły",
        variant: "destructive"
      });
      navigate("/blog");
      return;
    }
    
    if (id) {
      fetchBlogPost(id);
    }
  }, [id, isAdmin, navigate]);

  const fetchBlogPost = async (postId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      setPost(data as BlogPost);
      setValue("title", data.title);
      setValue("summary", data.summary || "");
      setContent(data.content);
      
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Błąd pobierania artykułu",
        description: error.message,
        variant: "destructive"
      });
      navigate("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (postId: string) => {
    if (!imageFile) return post?.image_url || null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${postId}-${Date.now()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, imageFile);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const onSubmit = async (formData: {title: string; summary: string}) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      let postId = id;
      let imageUrl = post?.image_url || null;
      
      // Create new post or update existing one
      if (!postId) {
        // Create new post first to get an ID
        const { data: newPost, error: createError } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            summary: formData.summary,
            content: content,
            author_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (createError) throw createError;
        postId = newPost.id;
      }
      
      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(postId);
      }
      
      // Update the post with image URL if needed
      if (id) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            summary: formData.summary,
            content: content,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (updateError) throw updateError;
      } else if (imageUrl) {
        // Update the new post with image URL
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ image_url: imageUrl })
          .eq('id', postId);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: id ? "Artykuł zaktualizowany" : "Artykuł dodany",
        description: id 
          ? "Zaktualizowano artykuł w bazie danych." 
          : "Dodano nowy artykuł do bloga.",
      });
      
      navigate(`/blog/${postId}`);
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Błąd zapisywania artykułu",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Ładowanie artykułu...</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/blog")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Wróć do wszystkich artykułów
          </Button>
        </div>
        
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {id ? "Edytuj artykuł" : "Dodaj nowy artykuł"}
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tytuł artykułu</Label>
                <Input
                  id="title"
                  placeholder="Wpisz tytuł artykułu..."
                  {...register("title", { required: true })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">Tytuł jest wymagany</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Krótkie podsumowanie (opcjonalne)</Label>
                <Textarea
                  id="summary"
                  placeholder="Wpisz krótkie podsumowanie artykułu..."
                  {...register("summary")}
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Zdjęcie główne (opcjonalne)</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Wybierz zdjęcie
                  </Button>
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {(imagePreview || post?.image_url) && (
                    <span className="text-sm text-muted-foreground">
                      Zdjęcie wybrane
                    </span>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2 relative rounded-md overflow-hidden h-48 bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Podgląd"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Treść artykułu</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Wpisz treść artykułu..."
                  className="min-h-[300px]"
                />
                {content.length === 0 && (
                  <p className="text-sm text-red-500">Treść artykułu jest wymagana</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/blog")}
              >
                Anuluj
              </Button>
              <Button 
                type="submit"
                disabled={isSaving || content.length === 0}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {id ? "Zapisz zmiany" : "Opublikuj artykuł"}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BlogPostForm;
