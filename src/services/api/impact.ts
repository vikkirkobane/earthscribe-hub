import { supabase } from '../supabase';

// Types for impact metrics
export interface ImpactMetric {
  id: string;
  plot_id: string;
  metric_type: 'hectares_restored' | 'co2_sequestered' | 'biodiversity_index' | 'water_retention' | 'soil_health';
  value: number;
  verification_source: string;
  measured_at: string;
}

export interface ImpactSummary {
  totalHectares: number;
  totalCo2Sequestered: number;
  totalBiodiversity: number;
  activePlots: number;
  questsCompleted: number;
  communityRank: number;
}

// Calculate hectares restored
export const calculateHectaresRestored = async (userId: string): Promise<number> => {
  try {
    // Get user's plots that are active or completed
    const { data: plots, error } = await supabase
      .from('plots')
      .select('area')
      .eq('user_id', userId)
      .in('status', ['active', 'completed']);

    if (error) throw error;

    return plots?.reduce((sum, plot) => sum + (plot.area || 0), 0) || 0;
  } catch (error) {
    console.error('Error calculating hectares restored:', error);
    return 0;
  }
};

// Calculate CO2 sequestered
export const calculateCo2Sequestered = async (userId: string): Promise<number> => {
  try {
    // In a real implementation, this would use more sophisticated calculations
    // based on vegetation type, growth, etc.
    
    // Get user's plots that have impact metrics
    const { data: metrics, error } = await supabase
      .from('impact_metrics')
      .select('value')
      .eq('metric_type', 'co2_sequestered');

    if (error) throw error;

    return metrics?.reduce((sum, metric) => sum + metric.value, 0) || 0;
  } catch (error) {
    console.error('Error calculating CO2 sequestered:', error);
    return 0;
  }
};

// Calculate biodiversity index
export const calculateBiodiversityIndex = async (userId: string): Promise<number> => {
  try {
    // This would be based on species observed in quest submissions
    // For now, using a mock calculation based on quest types completed
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        quests!inner(type)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    // Count distinct quest types as a proxy for biodiversity tracking
    const distinctTypes = [...new Set(submissions?.map(s => s.quests?.type) || [])];
    
    return distinctTypes.length * 3; // Just a simple formula for demo
  } catch (error) {
    console.error('Error calculating biodiversity index:', error);
    return 0;
  }
};

// Get user's impact summary
export const getUserImpactSummary = async (userId: string): Promise<ImpactSummary> => {
  try {
    const [
      totalHectares,
      totalCo2Sequestered,
      totalBiodiversity,
      activePlots,
      questsCompleted,
    ] = await Promise.all([
      calculateHectaresRestored(userId),
      calculateCo2Sequestered(userId),
      calculateBiodiversityIndex(userId),
      getUserActivePlots(userId),
      getUserQuestsCount(userId),
    ]);

    // Mock community rank (in real app, would be calculated against all users)
    const communityRank = Math.floor(Math.random() * 50) + 1;

    return {
      totalHectares,
      totalCo2Sequestered,
      totalBiodiversity,
      activePlots,
      questsCompleted,
      communityRank,
    };
  } catch (error) {
    console.error('Error getting impact summary:', error);
    return {
      totalHectares: 0,
      totalCo2Sequestered: 0,
      totalBiodiversity: 0,
      activePlots: 0,
      questsCompleted: 0,
      communityRank: 1000,
    };
  }
};

// Get user's active plots
export const getUserActivePlots = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('plots')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['active', 'planning']);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting active plots count:', error);
    return 0;
  }
};

// Get user's completed quests count
export const getUserQuestsCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting quests count:', error);
    return 0;
  }
};

// Save an impact metric
export const saveImpactMetric = async (
  plotId: string,
  metricType: ImpactMetric['metric_type'],
  value: number,
  verificationSource: string = 'user_submission'
): Promise<ImpactMetric | null> => {
  try {
    const { data, error } = await supabase
      .from('impact_metrics')
      .insert({
        plot_id: plotId,
        metric_type: metricType,
        value,
        verification_source: verificationSource,
      })
      .select()
      .single();

    if (error) throw error;

    return data as ImpactMetric;
  } catch (error) {
    console.error('Error saving impact metric:', error);
    return null;
  }
};

// Get impact metrics for a plot
export const getPlotImpactMetrics = async (plotId: string): Promise<ImpactMetric[]> => {
  try {
    const { data, error } = await supabase
      .from('impact_metrics')
      .select('*')
      .eq('plot_id', plotId)
      .order('measured_at', { ascending: false });

    if (error) throw error;

    return data as ImpactMetric[];
  } catch (error) {
    console.error('Error getting plot impact metrics:', error);
    return [];
  }
};

// Calculate estimated CO2 sequestered based on plot characteristics
export const calculatePlotCo2Estimate = (area: number, vegetationType: string = 'mixed'): number => {
  // Simplified calculation - in reality this would be more complex
  // Based on IPCC guidelines: 0.5-5 tons CO2/hectare/year depending on vegetation type
  const sequestrationRate = {
    'forest': 4.0,
    'mixed': 2.5,
    'grassland': 1.0,
    'wetland': 3.0
  }[vegetationType] || 2.5;

  return area * sequestrationRate;
};

// Calculate biodiversity improvement
export const calculateBiodiversityImprovement = (initialSpecies: number, currentSpecies: number): number => {
  if (initialSpecies === 0) return currentSpecies * 10; // New biodiversity
  return ((currentSpecies - initialSpecies) / initialSpecies) * 100;
};