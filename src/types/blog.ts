export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  meta_description?: string;
}

export interface BlogSettings {
  id: string;
  posts_per_page: number;
  updated_at: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  meta_description?: string;
}
