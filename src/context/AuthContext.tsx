/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ADMIN_EMAIL } from "../constants/constants";

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

type AuthResult = { data: unknown; error: unknown } | { data: null; error: Error };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name: string, role: 'user' | 'business') => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  updateProfile: (name: string, avatar_url?: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  resendVerificationEmail: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      if (!isSupabaseConfigured || !supabase) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Profile not found, creating...');
        return null;
      }

      // Normalize admin role for special email
      const normalized = data.email?.toLowerCase() === ADMIN_EMAIL ? { ...data, role: 'admin' } : data;
      
      // Update database if role was normalized
      if (normalized.role !== data.role) {
        await supabase.from('users').update({ role: 'admin' }).eq('id', userId);
      }

      setProfile(normalized);
      return normalized;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          console.warn('Supabase not configured - using demo mode');
          setLoading(false);
          return;
        }

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setLoading(false);
      }
    };

    initializeAuth();

    if (!isSupabaseConfigured || !supabase) return;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, newSession: Session | null) => {
        setSession(newSession);
        
        if (newSession?.user) {
          setUser(newSession.user);
          await fetchProfile(newSession.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'user' | 'business'
  ) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { data: null, error: new Error('Supabase not configured') };
      }

      // Normalize role to admin if special email
      const storeRole = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : role;

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: storeRole,
            name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          role: storeRole,
          verified: false,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error for profile creation, user can still be created
        }

        // Update auth state immediately
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { data: null, error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { data, error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear all user state
    setUser(null);
    setSession(null);
    setProfile(null);
    
    // Clear local storage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
    localStorage.removeItem('supabase.auth.user');
  };

  const resetPassword = async (email: string) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { data: null, error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { data: null, error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (name: string, avatar_url?: string) => {
    try {
      if (!isSupabaseConfigured || !supabase || !user) {
        return { data: null, error: new Error('Supabase not configured or no user') };
      }

      const updateData: Partial<Pick<UserProfile, 'name' | 'avatar_url'>> = { name };
      if (avatar_url) updateData.avatar_url = avatar_url;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Normalize admin role
      const normalized = data.email?.toLowerCase() === ADMIN_EMAIL ? { ...data, role: 'admin' } : data;
      
      setProfile(normalized);
      return { data: normalized, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (!isSupabaseConfigured || !supabase || !user?.email) {
        return { data: null, error: new Error('Supabase not configured or no email') };
      }

      // Use signup type which will send verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      return { data: { success: true }, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    isAdmin: profile?.role === 'admin',
    isBusiness: profile?.role === 'business',
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithGoogle,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
