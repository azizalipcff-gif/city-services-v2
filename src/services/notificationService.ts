import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'business_submission' | 'approval' | 'rejection' | 'review' | 'account_update' | 'message';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const notificationService = {
  // Create notification
  async create(userId: string, type: Notification['type'], title: string, message: string, notificationData?: any) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: notificationData,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create notification error:', error);
      return { data: null, error };
    }
  },

  // Get user notifications
  async getUserNotifications(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { data: null, error };
    }
  },

  // Get unread notifications count
  async getUnreadCount(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return { count: data?.length || 0, error: null };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { count: 0, error };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Mark as read error:', error);
      return { data: null, error };
    }
  },

  // Mark all as read
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { error };
    }
  },

  // Delete notification
  async delete(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { error };
    }
  },

  // Send business submission notification to admin
  async notifyBusinessSubmission(businessName: string, businessId: string, ownerId: string) {
    // Notify admin (azizalipcff@gmail.com)
    const adminEmail = 'azizalipcff@gmail.com';
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (adminUser) {
      await this.create(
        adminUser.id,
        'business_submission',
        'New Business Submission',
        `A new business "${businessName}" has been submitted for approval.`,
        { businessId, ownerId }
      );
    }

    // Notify business owner
    await this.create(
      ownerId,
      'business_submission',
      'Business Submitted',
      `Your business "${businessName}" has been submitted for approval. We'll review it shortly.`,
      { businessId }
    );
  },

  // Send approval notification
  async notifyApproval(businessName: string, businessId: string, ownerId: string) {
    await this.create(
      ownerId,
      'approval',
      'Business Approved',
      `Congratulations! Your business "${businessName}" has been approved and is now live.`,
      { businessId }
    );
  },

  // Send rejection notification
  async notifyRejection(businessName: string, businessId: string, ownerId: string) {
    await this.create(
      ownerId,
      'rejection',
      'Business Rejected',
      `Your business "${businessName}" was not approved. Please review our guidelines and try again.`,
      { businessId }
    );
  },

  // Send review notification
  async notifyReview(businessName: string, businessId: string, ownerId: string, rating: number, reviewerName: string) {
    await this.create(
      ownerId,
      'review',
      'New Review Received',
      `${reviewerName} left a ${rating}-star review for your business "${businessName}".`,
      { businessId, rating }
    );
  },

  // Send account update notification
  async notifyAccountUpdate(userId: string, updateType: string) {
    await this.create(
      userId,
      'account_update',
      'Account Updated',
      `Your account ${updateType} has been updated successfully.`
    );
  },
};
