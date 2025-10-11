// Supabase integration for TerraGuardian
// This file contains all the necessary functions to interact with Supabase

import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for TerraGuardian data
export type User = {
  id: string;
  email: string;
  name?: string;
  points?: number;
  streak_days?: number;
  created_at: string;
};

export type Quest = {
  id: string;
  type: string;
  title: string;
  description: string;
  points_reward: number;
  difficulty: string;
  location?: string; // GeoJSON or coordinates
  radius_km?: number;
  created_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  quest_id: string;
  photo_url?: string;
  location?: string; // GeoJSON or coordinates
  ai_validation_result?: any; // JSONB field
  points_earned: number;
  submitted_at: string;
};

export type Plot = {
  id: string;
  user_id: string;
  area_hectares: number;
  coordinates?: string; // GeoJSON polygon
  degradation_type: string;
  restoration_plan?: string;
  baseline_photo_url?: string;
  baseline_ndvi?: number;
  status: string;
  claimed_at: string;
};

export type ImpactMetric = {
  id: string;
  plot_id: string;
  metric_type: string;
  value: number;
  verification_source: string;
  measured_at: string;
};

export type Badge = {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
};

// Authentication functions
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

  const { data, error } = result;
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

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

// Contact form functions
export const submitContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
      status: 'new',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact message:', error);
    throw new Error(error.message || 'Failed to submit contact message');
  }

  if (!data) {
    throw new Error('No data returned from Supabase');
  }

  return data as ContactMessage;
};

// User functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, points, streak_days, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
};

// Quest functions
export const getAvailableQuests = async (userId: string) => {
  // This would typically filter quests based on user location and preferences
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .limit(20);

  if (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }

  return data;
};

export const getQuestById = async (questId: string) => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', questId)
    .single();

  if (error) {
    console.error('Error fetching quest:', error);
    throw error;
  }

  return data;
};

// Submission functions
export const createSubmission = async (submissionData: Omit<Submission, 'id' | 'submitted_at'>) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      ...submissionData,
      submitted_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating submission:', error);
    throw error;
  }

  return data;
};

export const getUserSubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }

  return data;
};

// Plot functions
export const getUserPlots = async (userId: string) => {
  const { data, error } = await supabase
    .from('plots')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user plots:', error);
    throw error;
  }

  return data;
};

export const createPlot = async (plotData: Omit<Plot, 'id' | 'claimed_at'>) => {
  const { data, error } = await supabase
    .from('plots')
    .insert([{
      ...plotData,
      claimed_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating plot:', error);
    throw error;
  }

  return data;
};

// Impact metric functions
export const getPlotImpactMetrics = async (plotId: string) => {
  const { data, error } = await supabase
    .from('impact_metrics')
    .select('*')
    .eq('plot_id', plotId)
    .order('measured_at', { ascending: false });

  if (error) {
    console.error('Error fetching impact metrics:', error);
    throw error;
  }

  return data;
};

// Badge functions
export const getUserBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user badges:', error);
    throw error;
  }

  return data;
};