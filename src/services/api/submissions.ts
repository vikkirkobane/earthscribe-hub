import { supabase } from '../supabase';
import { Submission, getQuestById } from './quests';
import { storageService } from '../storage';

// Points configuration for different quest types
export const QUEST_POINTS = {
  easy: 50,
  medium: 75,
  hard: 100
};

// Badge criteria configuration
interface BadgeCriteria {
  name: string;
  type: 'land_guardian' | 'eco_warrior' | 'restoration_hero' | 'streak_master' | 'diversity_champion' | 'community_leader' | 'early_adopter' | 'perfectionist';
  condition: (userData: any) => boolean;
  description: string;
}

export const BADGE_CRITERIA: BadgeCriteria[] = [
  {
    name: "Land Guardian",
    type: "land_guardian",
    condition: (userData) => userData.questsCompleted >= 10,
    description: "Complete 10 quests"
  },
  {
    name: "Eco Warrior", 
    type: "eco_warrior",
    condition: (userData) => userData.questsCompleted >= 50,
    description: "Complete 50 quests"
  },
  {
    name: "Restoration Hero",
    type: "restoration_hero", 
    condition: (userData) => userData.questsCompleted >= 100,
    description: "Complete 100 quests"
  },
  {
    name: "Streak Master",
    type: "streak_master",
    condition: (userData) => userData.currentStreak >= 7,
    description: "Maintain a 7-day streak"
  },
  {
    name: "Diversity Champion",
    type: "diversity_champion",
    condition: (userData) => userData.questTypesCompleted?.length >= 5, // All 5 quest types
    description: "Complete all quest types"
  },
  {
    name: "Community Leader",
    type: "community_leader",
    condition: (userData) => userData.communityRank <= 10,
    description: "Be in top 10 of community"
  },
  {
    name: "Early Adopter",
    type: "early_adopter",
    condition: (userData) => userData.userRank <= 100,
    description: "Be among first 100 users"
  },
  {
    name: "Perfectionist",
    type: "perfectionist",
    condition: (userData) => userData.perfectValidations >= 10,
    description: "Complete 10 quests with perfect validation"
  }
];

// Submit a quest completion with validation result
export const submitQuestWithValidation = async (
  userId: string,
  questId: string,
  photoUrl?: string,
  location?: string,
  validation?: any
): Promise<{ submission: Submission; pointsEarned: number; badgesEarned: string[] }> => {
  try {
    // Determine points based on quest difficulty (would need to fetch quest details)
    const questDetails = await getQuestById(questId);
    const difficulty = questDetails?.difficulty || 'medium';
    const basePoints = QUEST_POINTS[difficulty as keyof typeof QUEST_POINTS] || QUEST_POINTS.medium;
    
    // Additional points for high confidence validation
    const validationMultiplier = validation?.confidence ? Math.min(validation.confidence / 0.7, 2.0) : 1.0; // Cap at 2x
    const pointsEarned = Math.round(basePoints * validationMultiplier);
    
    // Create the submission record
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id: userId,
        quest_id: questId,
        photo_url: photoUrl,
        location: location,
        ai_validation_result: validation,
        points_earned: pointsEarned,
        validated_at: validation ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (submissionError) throw submissionError;

    // Update user's total points
    await updateUserPoints(userId, pointsEarned);

    // Check for badge eligibility
    const badgesEarned = await checkAndAwardBadges(userId);

    // Return the submission result with points and badges earned
    return {
      submission: submissionData as Submission,
      pointsEarned,
      badgesEarned
    };
  } catch (error) {
    console.error('Error submitting quest with validation:', error);
    throw error;
  }
};

// Update user's points
export const updateUserPoints = async (userId: string, pointsToAdd: number) => {
  try {
    // Get current points
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Update with new points
    const newPoints = (userData?.points || 0) + pointsToAdd;
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newPoints, last_active: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Update offline storage as well
    try {
      await storageService.saveUser({
        id: userId,
        points: newPoints,
        updated_at: new Date().toISOString()
      } as any);
    } catch (storageError) {
      console.error('Error updating offline user data:', storageError);
    }
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
};

// Check and award badges based on user's activities
export const checkAndAwardBadges = async (userId: string): Promise<string[]> => {
  try {
    // Get user's data to evaluate badge criteria
    const userData = await getUserDataForBadges(userId);

    // Check all badge criteria
    const earnedBadges: string[] = [];
    
    for (const badge of BADGE_CRITERIA) {
      try {
        if (badge.condition(userData)) {
          // Check if user already has this badge
          const { data: existingBadge, error } = await supabase
            .from('badges')
            .select('*')
            .eq('user_id', userId)
            .eq('badge_type', badge.type)
            .single();

          if (!existingBadge && !error) {
            // Award the badge
            const { error: insertError } = await supabase
              .from('badges')
              .insert({
                user_id: userId,
                badge_type: badge.type
              });
            
            if (!insertError) {
              earnedBadges.push(badge.name);
            }
          }
        }
      } catch (badgeError) {
        console.error(`Error checking badge ${badge.name}:`, badgeError);
      }
    }

    return earnedBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

// Get user data needed for badge evaluation
export const getUserDataForBadges = async (userId: string) => {
  try {
    // Get user profile info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points, streak_days, created_at')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get number of quests completed
    const { count: questsCompleted, error: countError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    // Get distinct quest types completed
    const { data: questTypesData, error: typesError } = await supabase
      .from('submissions')
      .select('quest_id')
      .eq('user_id', userId);

    if (typesError) throw typesError;

    // We would need to join with quests table to get types, simplifying for now
    const questTypesCompleted = ['soil_erosion', 'crop_health', 'water_monitoring', 'vegetation_health', 'degraded_land']; // Placeholder

    // Get validation stats
    const { data: validationStats, error: validationError } = await supabase
      .from('submissions')
      .select('ai_validation_result')
      .eq('user_id', userId)
      .not('ai_validation_result', 'is', null);

    if (validationError) throw validationError;

    // Count perfect validations (confidence > 0.9)
    const perfectValidations = validationStats?.filter(sub => 
      sub.ai_validation_result?.confidence && sub.ai_validation_result.confidence > 0.9
    ).length || 0;

    // Get community rank (simplified)
    const { count: totalUsers, error: totalUsersError } = await supabase
      .from('users') 
      .select('*', { count: 'exact', head: true });

    if (totalUsersError) throw totalUsersError;

    // Simplified rank calculation
    const communityRank = Math.min(10, totalUsers || 1000); // Placeholder

    return {
      points: user?.points || 0,
      streak: user?.streak_days || 0,
      questsCompleted: questsCompleted || 0,
      questTypesCompleted,
      perfectValidations,
      communityRank,
      userRank: 100, // Placeholder
      created_at: user?.created_at
    };
  } catch (error) {
    console.error('Error getting user data for badges:', error);
    return {
      points: 0,
      streak: 0,
      questsCompleted: 0,
      questTypesCompleted: [],
      perfectValidations: 0,
      communityRank: 1000,
      userRank: 1000,
      created_at: new Date().toISOString()
    };
  }
};

// Get user's earned badges
export const getUserBadges = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
};

// Get all possible badges with descriptions
export const getAvailableBadges = () => {
  return BADGE_CRITERIA;
};

// Get user's streak information
export const getUserStreak = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('streak_days')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return user?.streak_days || 0;
  } catch (error) {
    console.error('Error getting user streak:', error);
    return 0;
  }
};

// Update user's streak
export const updateStreak = async (userId: string, isConsecutiveDay: boolean) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('streak_days, last_active')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Calculate if it's a consecutive day (simplified logic)
    const lastActive = user?.last_active ? new Date(user.last_active) : null;
    const now = new Date();
    const timeDiff = now.getTime() - (lastActive?.getTime() || 0);
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    let newStreak = 0;
    if (daysDiff <= 1) {
      // If active yesterday or today, increment streak
      newStreak = (user?.streak_days || 0) + 1;
    } else {
      // If not consecutive, reset to 1 (or 0 if it was more than 2 days)
      newStreak = 1;
    }

    // Update the user's streak
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        streak_days: newStreak, 
        last_active: now.toISOString() 
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Update offline storage as well
    try {
      await storageService.saveUser({
        id: userId,
        streak_days: newStreak,
        updated_at: new Date().toISOString()
      } as any);
    } catch (storageError) {
      console.error('Error updating offline streak data:', storageError);
    }
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};