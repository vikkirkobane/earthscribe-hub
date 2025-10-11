import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development without Supabase credentials, provide mock functionality
let supabaseClient;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key in environment variables. Running in development mode without Supabase.');
  
  // Export a mock client during development when Supabase credentials are missing
  supabaseClient = {
    auth: {
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
    rpc: () => Promise.resolve({ data: [], error: null }),
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

// Helper functions for authentication
export const signUp = async (email: string, password: string, name?: string) => {
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || '',
      },
    },
  });
  
  // Handle both real Supabase client and mock client response
  const { data, error } = result;
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  // Handle both real Supabase client and mock client response
  const { data, error } = result;
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const result = await supabase.auth.signOut();
  if (result.error) throw result.error;
};

export const getCurrentUser = async () => {
  const result = await supabase.auth.getUser();
  if (result.error) throw result.error;
  return result.data?.user || null;
};

export const resetPassword = async (email: string) => {
  const result = await supabase.auth.resetPasswordForEmail(email);
  if (result.error) throw result.error;
};

export const updatePassword = async (password: string) => {
  const result = await supabase.auth.updateUser({ password });
  if (result.error) throw result.error;
};

// Types for user data
export type User = {
  id: string;
  email: string;
  name?: string;
  points?: number;
  streak_days?: number;
  created_at: string;
};