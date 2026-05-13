import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  // Send business submission notification
  async sendBusinessSubmissionNotification(email: string, businessName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d4af37;">Business Submitted Successfully</h1>
        <p>Dear User,</p>
        <p>Your business <strong>"${businessName}"</strong> has been submitted for approval.</p>
        <p>Our team will review your submission and notify you once it's approved.</p>
        <p>Thank you for using CityServices!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail(email, 'Business Submitted - CityServices', html);
  },

  // Send approval notification
  async sendApprovalNotification(email: string, businessName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d4af37;">Business Approved!</h1>
        <p>Dear User,</p>
        <p>Congratulations! Your business <strong>"${businessName}"</strong> has been approved and is now live on CityServices.</p>
        <p>Customers can now discover and connect with your business.</p>
        <a href="https://cityservices.ma/business-dashboard" style="display: inline-block; background-color: #d4af37; color: #071126; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">View Your Business</a>
        <p style="margin-top: 20px;">Thank you for using CityServices!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail(email, 'Business Approved - CityServices', html);
  },

  // Send rejection notification
  async sendRejectionNotification(email: string, businessName: string, reason?: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d4af37;">Business Not Approved</h1>
        <p>Dear User,</p>
        <p>Unfortunately, your business <strong>"${businessName}"</strong> was not approved.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please review our guidelines and make the necessary changes before submitting again.</p>
        <a href="https://cityservices.ma/business-management" style="display: inline-block; background-color: #d4af37; color: #071126; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">Update Your Business</a>
        <p style="margin-top: 20px;">Thank you for using CityServices!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail(email, 'Business Not Approved - CityServices', html);
  },

  // Send review notification
  async sendReviewNotification(email: string, businessName: string, rating: number, reviewerName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d4af37;">New Review Received</h1>
        <p>Dear User,</p>
        <p><strong>${reviewerName}</strong> left a ${rating}-star review for your business <strong>"${businessName}"</strong>.</p>
        <a href="https://cityservices.ma/business-dashboard" style="display: inline-block; background-color: #d4af37; color: #071126; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">View Reviews</a>
        <p style="margin-top: 20px;">Thank you for using CityServices!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail(email, `New Review for ${businessName} - CityServices`, html);
  },

  // Send account update notification
  async sendAccountUpdateNotification(email: string, updateType: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d4af37;">Account Updated</h1>
        <p>Dear User,</p>
        <p>Your account ${updateType} has been updated successfully.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <a href="https://cityservices.ma/dashboard" style="display: inline-block; background-color: #d4af37; color: #071126; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">View Your Account</a>
        <p style="margin-top: 20px;">Thank you for using CityServices!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    return this.sendEmail(email, 'Account Updated - CityServices', html);
  },

  // Send email using Supabase
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Email send error:', error);
      // In development, log the email instead of failing
      if (import.meta.env.DEV) {
        console.log('Email would be sent:', { to, subject, html });
        return { data: { sent: true }, error: null };
      }
      return { data: null, error };
    }
  },
};
