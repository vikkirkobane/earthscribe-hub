import { supabase } from './supabase';
import { User } from './supabase';

// Types for Claude API integration
export interface ClaudeMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  context: any;
  created_at: string;
}

export interface ClaudeContext {
  userId: string;
  location: string | null;
  climate: string | null;
  soilType: string | null;
  season: string;
  recentQuests: any[];
  currentPlot?: any;
}

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-sonnet-20240229'; // Using a default model
const MAX_TOKENS = 1000;

// Get Claude API key from environment - in a real app this would come from your backend
const getClaudeApiKey = () => {
  return import.meta.env.VITE_CLAUDE_API_KEY;
};

// Create a base prompt template for TerraGuardian
const createBasePrompt = (context: ClaudeContext) => {
  let prompt = `You are an expert in regenerative agriculture and land restoration. A community member needs advice on land stewardship.`;

  // Add context information if available
  if (context.location) {
    prompt += `\nUser is located in: ${context.location}`;
  }
  
  if (context.climate) {
    prompt += `\nLocal climate: ${context.climate}`;
  }
  
  if (context.soilType) {
    prompt += `\nSoil type: ${context.soilType}`;
  }
  
  prompt += `\nCurrent season: ${context.season}`;
  
  if (context.recentQuests && context.recentQuests.length > 0) {
    prompt += `\nRecent land observations from user: ${context.recentQuests.map(q => q.title).join(', ')}`;
  }

  prompt += `\n\nProvide practical, actionable advice that is specific to their local conditions, uses locally available resources, includes step-by-step instructions, explains why practices work, and mentions potential challenges.`;
  
  return prompt;
};

// Prompt templates for different categories
const PROMPT_TEMPLATES: Record<string, string> = {
  soil_health: `You are an expert in soil health improvement. A farmer needs advice on improving soil quality.

Context:
- Location: {LOCATION}
- Climate: {CLIMATE}
- Soil type: {SOIL_TYPE}
- Season: {SEASON}
- Recent observations: {RECENT_QUESTS}

Question: {USER_QUESTION}

Provide practical advice on composting, cover crops, mulching, erosion control, and other soil health practices that are specific to their conditions.`,
  
  native_species: `You are an expert in native species selection for land restoration. A farmer needs advice on which native plants to use.

Context:
- Location: {LOCATION}
- Climate: {CLIMATE}
- Current land condition: {CONDITION}
- Season: {SEASON}

Question: {USER_QUESTION}

Recommend specific native species that are appropriate for their conditions and explain planting and care instructions.`,
  
  seasonal_planning: `You are an expert in seasonal planning for land restoration. A farmer needs advice on what to do during this season.

Context:
- Location: {LOCATION}
- Current season: {SEASON}
- Climate: {CLIMATE}
- Recent land activities: {RECENT_ACTIVITIES}

Question: {USER_QUESTION}

Provide seasonal action plans with specific timing recommendations.`,
  
  erosion_control: `You are an expert in erosion control. A farmer has identified erosion issues.

Context:
- Location: {LOCATION}
- Climate: {CLIMATE}
- Erosion type: {EROSION_TYPE}
- Season: {SEASON}

Question: {USER_QUESTION}

Recommend specific erosion control strategies like terracing, contour plowing, vegetative barriers, and water harvesting techniques.`,
  
  water_management: `You are an expert in water management for land restoration.

Context:
- Location: {LOCATION}
- Climate: {CLIMATE}
- Water availability: {WATER_AVAILABILITY}
- Season: {SEASON}

Question: {USER_QUESTION}

Provide water management techniques appropriate for their specific conditions.`
};

// Function to get user context for Claude API
export const getUserContext = async (userId: string): Promise<ClaudeContext> => {
  try {
    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, location')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get user's recent quests (last 5)
    const { data: recentQuests, error: questsError } = await supabase
      .from('submissions')
      .select(`
        quests!inner(title, type),
        submitted_at
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (questsError) throw questsError;

    // Get current plots
    const { data: plots, error: plotsError } = await supabase
      .from('plots')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'planning']);

    if (plotsError) throw plotsError;

    // Determine season based on location and current date
    // Simplified - in a real app, this would be more sophisticated
    const now = new Date();
    const month = now.getMonth();
    let season = 'Unknown';
    if (month >= 2 && month <= 4) season = 'Spring';
    else if (month >= 5 && month <= 7) season = 'Summer';
    else if (month >= 8 && month <= 10) season = 'Fall';
    else season = 'Winter';

    return {
      userId,
      location: userData?.location ? JSON.stringify(userData.location) : null,
      climate: null, // Would come from a weather/climate API
      soilType: null, // Would come from user profile or soil data
      season,
      recentQuests: recentQuests || [],
      currentPlot: plots?.[0] || undefined
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    // Return a basic context in case of error
    return {
      userId,
      location: null,
      climate: null,
      soilType: null,
      season: 'Unknown',
      recentQuests: [],
    };
  }
};

// Function to send message to Claude API
export const sendMessageToClaude = async (message: string, context: ClaudeContext): Promise<string> => {
  try {
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }

    // Create the full prompt with context
    const basePrompt = createBasePrompt(context);
    const fullPrompt = `${basePrompt}\n\nUser question: ${message}\n\nAssistant:`;

    // In a real implementation, you would call the Claude API
    // For now, return a mock response
    console.log('Sending message to Claude:', fullPrompt);
    
    // Mock response for demonstration
    const mockResponses: Record<string, string> = {
      'soil': `Based on your location and climate, I recommend starting with composting using local organic materials. Create a compost pile with kitchen scraps, dried leaves, and small amounts of soil to introduce beneficial microorganisms. Turn the pile every 2 weeks to aerate it. For cover crops, consider legumes like beans or peas that will fix nitrogen in your soil while protecting it from erosion.`,
      'water': `For water management in your area, I suggest implementing rainwater harvesting. Create small swales or trenches along contour lines to capture and direct rainwater to your plants. Mulch around your plants with locally available materials to reduce evaporation. If possible, install a simple rain collection system using local materials.`,
      'erosion': `To control erosion on your land, plant cover crops immediately. Consider fast-growing grasses or legumes that will establish roots quickly. Create terraces on slopes greater than 3% using logs, rocks, or earth bunds. Plant vetiver grass in contour lines every 2-3 meters on slopes - it's excellent for erosion control.`,
      'native': `For your area, I recommend native species like Acacia trees, which fix nitrogen and provide shade. Plant them in association with local grasses and forbs. Consider indigenous fruit trees if appropriate for your climate zone. Space trees according to their mature size, typically 4-6 meters apart for medium-sized trees.`,
      'default': `Thank you for your question about land restoration. Based on your location and recent activities, I can provide specific advice. For your soil health, consider adding organic matter like compost or well-aged manure. For water management, implement conservation techniques like mulching and rainwater harvesting. For erosion control, plant cover crops and create terraces where needed. Start with small, manageable changes and expand as you gain experience.`
    };

    // Determine which response to return based on keywords
    const messageLower = message.toLowerCase();
    if (messageLower.includes('soil') || messageLower.includes('compost')) {
      return mockResponses.soil;
    } else if (messageLower.includes('water') || messageLower.includes('rain')) {
      return mockResponses.water;
    } else if (messageLower.includes('erosion') || messageLower.includes('runoff')) {
      return mockResponses.erosion;
    } else if (messageLower.includes('plant') || messageLower.includes('tree') || messageLower.includes('native')) {
      return mockResponses.native;
    } else {
      return mockResponses.default;
    }
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw error;
  }
};

// Function to save chat history
export const saveChatHistory = async (userId: string, message: string, response: string, context: any): Promise<ClaudeMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        message,
        response,
        context
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving chat history:', error);
      return null;
    }

    return data as ClaudeMessage;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return null;
  }
};

// Function to get user's chat history
export const getChatHistory = async (userId: string, limit: number = 20): Promise<ClaudeMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting chat history:', error);
      return [];
    }

    return data as ClaudeMessage[];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

// Function to generate educational content based on quest completion
export const generateEducationalContent = async (questType: string, context: ClaudeContext): Promise<string> => {
  try {
    const contentPrompts: Record<string, string> = {
      soil_erosion: `Generate educational content about ${questType.replace('_', ' ')} for rural farmers. Requirements: 5th-8th grade reading level, 150-200 words, include one practical example, relate to ${context.location || 'local conditions'}, use inspiring and empowering tone. Format: Short paragraph with bullet points for key takeaways.`,
      crop_health: `Generate educational content about ${questType.replace('_', ' ')} for rural farmers. Requirements: 5th-8th grade reading level, 150-200 words, include one practical example, relate to ${context.location || 'local conditions'}, use inspiring and empowering tone. Format: Short paragraph with bullet points for key takeaways.`,
      water_monitoring: `Generate educational content about ${questType.replace('_', ' ')} for rural farmers. Requirements: 5th-8th grade reading level, 150-200 words, include one practical example, relate to ${context.location || 'local conditions'}, use inspiring and empowering tone. Format: Short paragraph with bullet points for key takeaways.`,
      vegetation_health: `Generate educational content about ${questType.replace('_', ' ')} for rural farmers. Requirements: 5th-8th grade reading level, 150-200 words, include one practical example, relate to ${context.location || 'local conditions'}, use inspiring and empowering tone. Format: Short paragraph with bullet points for key takeaways.`,
      degraded_land: `Generate educational content about ${questType.replace('_', ' ')} for rural farmers. Requirements: 5th-8th grade reading level, 150-200 words, include one practical example, relate to ${context.location || 'local conditions'}, use inspiring and empowering tone. Format: Short paragraph with bullet points for key takeaways.`
    };

    // Use the template to generate content
    const prompt = contentPrompts[questType as keyof typeof contentPrompts] || 
      `Generate educational content about ${questType.replace('_', ' ')} for rural farmers.`;

    // In a real implementation, you would call the Claude API
    // For now, return mock content
    const mockContent = `This is educational content about ${questType.replace('_', ' ')}. It provides practical advice that is easy to understand and implement. Key takeaways include:\n• Take small steps to improve your land\n• Use locally available materials\n• Work with the seasons\n• See your efforts make a difference`;
    
    return mockContent;
  } catch (error) {
    console.error('Error generating educational content:', error);
    return "Could not generate educational content at this time. Please try again.";
  }
};

// Function to create a prompt based on category
export const createCategoryPrompt = (category: string, userQuestion: string, context: ClaudeContext): string => {
  const template = PROMPT_TEMPLATES[category as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.soil_health;
  
  return template
    .replace('{LOCATION}', context.location || 'your area')
    .replace('{CLIMATE}', context.climate || 'your local climate')
    .replace('{SOIL_TYPE}', context.soilType || 'your soil type')
    .replace('{SEASON}', context.season)
    .replace('{RECENT_QUESTS}', context.recentQuests.map(q => q.title).join(', ') || 'your recent observations')
    .replace('{USER_QUESTION}', userQuestion)
    .replace('{CONDITION}', context.currentPlot?.degradation_type || 'current land condition')
    .replace('{RECENT_ACTIVITIES}', context.recentQuests.map(q => q.title).join(', ') || 'recent land activities')
    .replace('{EROSION_TYPE}', context.currentPlot?.degradation_type || 'erosion type')
    .replace('{WATER_AVAILABILITY}', 'your water availability');
};