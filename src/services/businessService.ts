import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';
import type { Business } from '../types';

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
          approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification for business submission
      await notificationService.notifyBusinessSubmission(business.name, data.id, userId);

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

  // Get all public businesses (approved and verified) - Optimized with selective fields
  async getPublic(filters?: { category?: string; city?: string; search?: string }) {
    try {
      console.log('Fetching public businesses...');
      let query = supabase
        .from('businesses')
        .select('id, name, slug, category, city, rating, reviews_count, logo_url, address, verified, featured, shortDescription')
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
          `name.ilike.%${filters.search}%,shortDescription.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order('rating', { ascending: false }).limit(50);

      if (error) {
        console.error('Supabase getPublic error:', error);
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

  // Search businesses - Optimized with selective fields and limit
  async search(query: string, city?: string) {
    try {
      let searchQuery = supabase
        .from('businesses')
        .select('id, name, slug, category, city, rating, reviews_count, logo_url, address, shortDescription')
        .eq('approved', true)
        .eq('verified', true)
        .or(
          `name.ilike.%${query}%,shortDescription.ilike.%${query}%,category.ilike.%${query}%,address.ilike.%${query}%`
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

  // Get search suggestions
  async getSearchSuggestions(query: string) {
    try {
      if (query.length < 2) {
        return { data: [], error: null };
      }

      // Get businesses for name and description suggestions
      const { data: businesses } = await this.search(query);
      
      // Get all businesses for categories and cities
      const { data: allBusinesses } = await this.getPublic();
      
      // Get unique categories that match
      const categories = [...new Set(allBusinesses?.map((business: any) => business.category) || [])]
        .filter((cat: string) => cat.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((cat: string) => ({
          id: cat,
          name: cat,
          category: cat,
          city: '',
          description: `Browse ${cat} services`,
          rating: 0,
          type: 'category'
        }));

      // Get unique cities that match (including Moroccan cities)
      const cities = [...new Set(allBusinesses?.map((business: any) => business.city) || [])]
        .filter((city: string) => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((city: string) => ({
          id: city,
          name: city,
          category: '',
          city: city,
          description: `Services in ${city}`,
          rating: 0,
          type: 'city'
        }));

      return { data: [...businesses, ...categories, ...cities], error: null };
    } catch (error) {
      console.error('getSearchSuggestions error:', error);
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

  // Get nearby businesses by coordinates
  async getNearby(lat: number, lng: number, radiusKm: number = 10) {
    try {
      // Haversine formula to calculate distance
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const { data: allBusinesses, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true);

      if (error) throw error;

      const nearbyBusinesses = allBusinesses?.filter((business: any) => {
        if (!business.coordinates_lat || !business.coordinates_lng) return false;
        const distance = calculateDistance(
          lat,
          lng,
          business.coordinates_lat,
          business.coordinates_lng
        );
        return distance <= radiusKm;
      }).map((business: any) => ({
        ...business,
        distance: calculateDistance(lat, lng, business.coordinates_lat, business.coordinates_lng)
      })).sort((a: any, b: any) => a.distance - b.distance);

      return { data: nearbyBusinesses, error: null };
    } catch (error) {
      console.error('Get nearby businesses error:', error);
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

      // Get business details for notification
      const { data: business } = await supabase
        .from('businesses')
        .select('name, owner_id')
        .eq('id', businessId)
        .single();

      if (business) {
        // Get reviewer name
        const { data: user } = await supabase
          .from('users')
          .select('name')
          .eq('id', userId)
          .single();

        const reviewerName = user?.name || 'A user';
        await notificationService.notifyReview(business.name, businessId, business.owner_id, rating, reviewerName);
      }

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

  // Update review
  async update(reviewId: string, rating: number, comment: string) {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .select('business_id')
        .eq('id', reviewId)
        .single();

      if (error) throw error;

      const { data, error: updateError } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', reviewId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update business rating
      await this.updateBusinessRating(review.business_id);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete review
  async delete(reviewId: string) {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .select('business_id')
        .eq('id', reviewId)
        .single();

      if (error) throw error;

      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (deleteError) throw deleteError;

      // Update business rating
      await this.updateBusinessRating(review.business_id);

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's review for a business
  async getUserReview(businessId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
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
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, returning empty pending businesses');
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get pending businesses error:', error);
        return { data: [], error: null };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Get pending businesses error:', error);
      return { data: [], error: null };
    }
  },

  // Approve business
  async approve(businessId: string) {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, cannot approve business');
        return { data: null, error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase
        .from('businesses')
        .update({ approved: true })
        .eq('id', businessId)
        .select()
        .single();

      if (error) {
        console.error('Approve business error:', error);
        return { data: null, error };
      }

      // Send notification for approval
      await notificationService.notifyApproval(data.name, businessId, data.owner_id);

      return { data, error: null };
    } catch (error) {
      console.error('Approve business error:', error);
      return { data: null, error };
    }
  },

  // Reject business (mark as rejected instead of deleting)
  async reject(businessId: string) {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, cannot reject business');
        return { data: null, error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase
        .from('businesses')
        .update({ approved: false, rejected: true, rejected_at: new Date().toISOString() })
        .eq('id', businessId)
        .select()
        .single();

      if (error) {
        console.error('Reject business error:', error);
        return { data: null, error };
      }

      // Send notification for rejection
      await notificationService.notifyRejection(data.name, businessId, data.owner_id);

      return { data, error: null };
    } catch (error) {
      console.error('Reject business error:', error);
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
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, returning empty users');
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get all users error:', error);
        return { data: [], error: null };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Get all users error:', error);
      return { data: [], error: null };
    }
  },

  // Get all businesses
  async getAllBusinesses() {
    try {
      console.log('Fetching all businesses...');
      
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, returning mock data');
        return { data: [], error: null };
      }

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
        // Return empty array instead of throwing error to prevent UI breaking
        return { data: [], error: null };
      }

      console.log('Successfully fetched businesses:', data?.length || 0);
      return { data, error: null };
    } catch (error) {
      console.error('getAllBusinesses error:', error);
      // Return empty array instead of null to prevent UI breaking
      return { data: [], error: null };
    }
  },

  // Get featured businesses
  async getFeatured(limit = 20) {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, returning empty featured businesses');
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', true)
        .eq('verified', true)
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get featured businesses error:', error);
        return { data: [], error: null };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Get featured businesses error:', error);
      return { data: [], error: null };
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
