export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  gallery_urls: string[] | null;
  rating: number;
  reviews_count: number;
  verified: boolean;
  featured: boolean;
  approved: boolean;
  price_range: '$' | '$$' | '$$$';
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  social_facebook: string | null;
  social_instagram: string | null;
  opening_hours: Array<{ day: string; hours: string }> | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'user' | 'business' | 'admin';
  verified: boolean;
  created_at: string;
  updated_at: string;
}