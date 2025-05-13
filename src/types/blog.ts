
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
  image_url?: string | null;
  summary?: string | null;
}
