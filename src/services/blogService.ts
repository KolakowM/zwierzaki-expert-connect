import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  meta_description: string | null;
  status: string;
  author_id: string;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogSettings {
  id: string;
  posts_per_page: number;
  updated_at: string;
}

export const getPublishedPosts = async (page: number = 1, perPage: number = 9) => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data as BlogPost[], total: count || 0 };
};

export const getPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const incrementViewCount = async (postId: string) => {
  // Simple increment - fetch current count and update
  const { data: post } = await supabase
    .from("blog_posts")
    .select("views_count")
    .eq("id", postId)
    .single();

  if (post) {
    await supabase
      .from("blog_posts")
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq("id", postId);
  }
};

export const getBlogSettings = async () => {
  const { data, error } = await supabase
    .from("blog_settings")
    .select("*")
    .single();

  if (error) throw error;
  return data as BlogSettings;
};

// Admin functions
export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
};

export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const createPost = async (post: Partial<BlogPost>) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: post.title!,
      slug: post.slug!,
      content: post.content!,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      meta_description: post.meta_description,
      status: post.status || "draft",
      author_id: post.author_id!,
      published_at: post.published_at,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const updatePost = async (id: string, post: Partial<BlogPost>) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};
