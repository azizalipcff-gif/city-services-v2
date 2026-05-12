import { supabase } from '../lib/supabase';
import type { Business } from './types';

// BUSINESS CRUD OPERATIONS
export const businessService = {
  // Create a new business
  async create(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...business,
          owner_id: userId,
          approved: false, // New businesses require admin approval
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get business by ID or slug
  async get(id: string) {
    try {
      // Try to fetch by ID first
      let { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      // If not found by ID, try by slug
      if (error && error.code === 'PGRST116') {
        ({ data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', id)
          .single());
      }

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get all public businesses (approved and verified)
  async getPublic(filters?: { category?: string; city?: string; search?: string }) {
    try {
      console.log('Fetching public businesses...');
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Supabase getPublic error:', error);
        // Check for RLS issues
        if (error.code === '42501') {
          console.error('RLS policy violation - check policies on businesses table');
        }
        throw error;
      }

      console.log('Successfully fetched public businesses:', data?.length || 0);
      return { data, error: null };
    } catch (error) {
      console.error('getPublic error:', error);
      return { data: null, error };
    }
  },

  // Get businesses by owner
  async getByOwner(userId: string) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update business
  async update(id: string, updates: Partial<Business>, userId: string) {
    try {
      // Verify ownership
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (business.owner_id !== userId) {
        throw new Error('Unauthorized: You do not own this business');
      }

      // Update the business
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete business
  async delete(id: string, userId: string) {
    try {
      // Verify ownership
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (business.owner_id !== userId) {
        throw new Error('Unauthorized: You do not own this business');
      }

      // Delete the business
      const { error } = await supabase.from('businesses').delete().eq('id', id);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Search businesses
  async search(query: string, city?: string) {
    try {
      let searchQuery = supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true)
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,address.ilike.%${query}%`
        );

      if (city) {
        searchQuery = searchQuery.eq('city', city);
      }

      const { data, error } = await searchQuery.order('rating', { ascending: false }).limit(50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get featured businesses
  async getFeatured(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true)
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get businesses by category
  async getByCategory(category: string, city?: string) {
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true)
        .eq('category', category);

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// REVIEW OPERATIONS
export const reviewService = {
  // Create review
  async create(businessId: string, userId: string, rating: number, comment: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          business_id: businessId,
          user_id: userId,
          rating,
          comment,
        })
        .select()
        .single();

      if (error) throw error;

      // Update business rating
      await this.updateBusinessRating(businessId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get reviews for a business
  async getByBusiness(businessId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(name, avatar_url)
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update business rating
  async updateBusinessRating(businessId: string) {
    try {
      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', businessId);

      if (reviewError) throw reviewError;

      if (reviews && reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length;

        await supabase
          .from('businesses')
          .update({
            rating: Math.round(avgRating * 10) / 10,
            reviews_count: reviews.length,
          })
          .eq('id', businessId);
      }
    } catch (error) {
      console.error('Error updating business rating:', error);
    }
  },
};

// FAVORITES OPERATIONS
export const favoriteService = {
  // Add to favorites
  async add(businessId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          business_id: businessId,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Remove from favorites
  async remove(businessId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('business_id', businessId)
        .eq('user_id', userId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user favorites
  async getByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('business:businesses(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Check if favorite exists
  async exists(businessId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('business_id', businessId)
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        return { data: false, error: null };
      }
      if (error) throw error;

      return { data: !!data, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },
};

// ADMIN OPERATIONS
export const adminService = {
  // Get pending businesses
  async getPending() {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Approve business
  async approve(businessId: string) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({ approved: true })
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Reject business
  async reject(businessId: string) {
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', businessId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Toggle verified status
  async toggleVerified(businessId: string) {
    try {
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('verified')
        .eq('id', businessId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('businesses')
        .update({ verified: !business.verified })
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Toggle featured status
  async toggleFeatured(businessId: string) {
    try {
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('featured')
        .eq('id', businessId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('businesses')
        .update({ featured: !business.featured })
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get all businesses
  async getAllBusinesses() {
    try {
      console.log('Fetching all businesses...');
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getAllBusinesses error:', error);
        // Check for RLS issues
        if (error.code === '42501') {
          console.error('RLS policy violation - check policies on businesses table');
        }
        throw error;
      }

      console.log('Successfully fetched businesses:', data?.length || 0);
      return { data, error: null };
    } catch (error) {
      console.error('getAllBusinesses error:', error);
      return { data: null, error };
    }
  },

  // Get featured businesses
  async getFeatured(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true)
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// IMAGE UPLOAD OPERATIONS
export const imageService = {
  // Upload business logo
  async uploadLogo(businessId: string, file: File) {
    try {
      const fileName = `${businessId}/logo.${file.name.split('.').pop()}`;

      const { error } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Upload cover image
  async uploadCover(businessId: string, file: File) {
    try {
      const fileName = `${businessId}/cover.${file.name.split('.').pop()}`;

      const { error } = await supabase.storage
        .from('business-covers')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('business-covers')
        .getPublicUrl(fileName);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Upload gallery image
  async uploadGallery(businessId: string, file: File) {
    try {
      const fileName = `${businessId}/gallery/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('business-gallery')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('business-gallery')
        .getPublicUrl(fileName);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
