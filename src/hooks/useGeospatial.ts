import { useState, useEffect } from 'react';
import { geospatialService, SatelliteImage, NDVIResult, PlotData } from '../services/geospatial';

interface UseSatelliteImageryResult {
  satelliteImages: SatelliteImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

interface UseNDVIResult {
  ndviData: NDVIResult[];
  isLoading: boolean;
  error: string | null;
  healthAssessment: {
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical',
    ndviValue: number,
    description: string,
    recommendations: string[]
  } | null;
  ndviTrend: {
    average: number,
    trend: 'increasing' | 'decreasing' | 'stable',
    values: NDVIResult[]
  } | null;
  refresh: () => void;
}

/**
 * Custom hook for fetching satellite imagery
 */
export const useSatelliteImagery = (bbox: [number, number, number, number] | null, dateRange?: { from: string; to: string }) => {
  const [satelliteImages, setSatelliteImages] = useState<SatelliteImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSatelliteImagery = async () => {
    if (!bbox) {
      setError('Bounding box is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Set default date range if not provided
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const fromTime = dateRange?.from || oneMonthAgo.toISOString().split('T')[0];
      const toTime = dateRange?.to || now.toISOString().split('T')[0];

      const data = await geospatialService.getSatelliteImagery(bbox, fromTime, toTime);
      setSatelliteImages(data);
    } catch (err) {
      console.error('Error fetching satellite imagery:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch satellite imagery');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bbox) {
      fetchSatelliteImagery();
    }
  }, [bbox, dateRange?.from, dateRange?.to]);

  return {
    satelliteImages,
    isLoading,
    error,
    refresh: fetchSatelliteImagery
  };
};

/**
 * Custom hook for NDVI analysis
 */
export const useNDVIAnalysis = (plotId: string) => {
  const [ndviData, setNdviData] = useState<NDVIResult[]>([]);
  const [healthAssessment, setHealthAssessment] = useState<UseNDVIResult['healthAssessment']>(null);
  const [ndviTrend, setNdviTrend] = useState<UseNDVIResult['ndviTrend']>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNDVIAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get plot data with NDVI history
      const plotData = await geospatialService.getPlotData(plotId);
      setNdviData(plotData.ndviHistory);

      // Get health assessment
      const health = await geospatialService.assessVegetationHealth(plotId);
      setHealthAssessment(health);

      // Get NDVI trend
      const trend = await geospatialService.getNDVITrend(plotId);
      setNdviTrend(trend);
    } catch (err) {
      console.error('Error fetching NDVI analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NDVI analysis');
      setNdviData([]);
      setHealthAssessment(null);
      setNdviTrend(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (plotId) {
      fetchNDVIAnalysis();
    }
  }, [plotId]);

  return {
    ndviData,
    healthAssessment,
    ndviTrend,
    isLoading,
    error,
    refresh: fetchNDVIAnalysis
  };
};

/**
 * Custom hook for plot data
 */
export const usePlotData = (plotId: string) => {
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlotData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await geospatialService.getPlotData(plotId);
      setPlotData(data);
    } catch (err) {
      console.error('Error fetching plot data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plot data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (plotId) {
      fetchPlotData();
    }
  }, [plotId]);

  return {
    plotData,
    isLoading,
    error,
    refresh: fetchPlotData
  };
};