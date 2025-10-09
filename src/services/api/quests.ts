import { supabase } from '../supabase';

// Types for quest data
export type Quest = {
  id: string;
  type: 'soil_erosion' | 'crop_health' | 'water_monitoring' | 'vegetation_health' | 'degraded_land';
  title: string;
  description: string;
  points_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  location?: string; // GeoJSON or other format
  radius_km?: number;
  created_at: string;
  updated_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  quest_id: string;
  photo_url?: string;
  location?: string;
  ai_validation_result?: any;
  points_earned: number;
  submitted_at: string;
  validated_at?: string;
};

// Get all available quests
export const getQuests = async (limit: number = 20, offset: number = 0): Promise<Quest[]> => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .limit(limit)
    .offset(offset)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Quest[];
};

// Get quests by type
export const getQuestsByType = async (type: string): Promise<Quest[]> => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('type', type);

  if (error) throw error;
  return data as Quest[];
};

// Get quest by ID
export const getQuestById = async (id: string): Promise<Quest | null> => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  return data as Quest;
};

// Get user's completed quests
export const getUserQuests = async (userId: string): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as Submission[];
};

// Submit a quest completion
export const submitQuest = async (
  userId: string,
  questId: string,
  photoUrl?: string,
  location?: string
): Promise<Submission> => {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: userId,
      quest_id: questId,
      photo_url: photoUrl,
      location: location
    })
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
};

// Get quests near user's location
export const getNearbyQuests = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<Quest[]> => {
  // Note: This is a simplified implementation
  // In a real app, you would use PostGIS functions for geographic queries
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .limit(20);

  if (error) throw error;
  return data as Quest[];
};

// Get quest types
export const getQuestTypes = async (): Promise<string[]> => {
  // This is a simplified implementation - in a real app you might have a dedicated table for quest types
  return ['soil_erosion', 'crop_health', 'water_monitoring', 'vegetation_health', 'degraded_land'];
};