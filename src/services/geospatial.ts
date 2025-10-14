import { useAuth } from "../contexts/AuthContext";

// Types for geospatial data
export interface SatelliteImage {
  id: string;
  date: string;
  url: string;
  thumbnail: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  metadata: {
    cloudCoverage: number;
    sensor: string;
    resolution: number;
  };
}

export interface NDVIResult {
  date: string;
  ndviValue: number;
  imageUrl: string;
}

export interface PlotData {
  id: string;
  name: string;
  coordinates: number[][];
  area: number; // in hectares
  ndviHistory: NDVIResult[];
  lastUpdated: string;
}

class GeospatialService {
  private sentinelHubClientId: string;
  private sentinelHubClientSecret: string;
  private googleEarthEngineKey: string;

  constructor() {
    this.sentinelHubClientId = import.meta.env.VITE_SENTINEL_HUB_CLIENT_ID || '';
    this.sentinelHubClientSecret = import.meta.env.VITE_SENTINEL_HUB_CLIENT_SECRET || '';
    this.googleEarthEngineKey = import.meta.env.VITE_GOOGLE_EARTH_ENGINE_KEY || '';
  }

  /**
   * Get OAuth token from Sentinel Hub
   */
  private async getSentinelHubToken(): Promise<string> {
    try {
      const response = await fetch('https://services.sentinel-hub.com/auth/realms/sentinel-hub/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': this.sentinelHubClientId,
          'client_secret': this.sentinelHubClientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub token request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Sentinel Hub token:', error);
      throw error;
    }
  }

  /**
   * Get satellite imagery from Sentinel Hub
   */
  async getSatelliteImagery(
    bbox: [number, number, number, number],  // [minX, minY, maxX, maxY]
    fromTime: string,
    toTime: string,
    maxCloudCoverage = 20
  ): Promise<SatelliteImage[]> {
    try {
      // Get access token
      const token = await this.getSentinelHubToken();

      // Define the request payload
      const requestBody = {
        input: {
          bounds: {
            bbox: bbox,
            properties: {
              crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84'
            }
          },
          data: [
            {
              type: 'sentinel-2-l2a',
              dataFilter: {
                timeRange: {
                  from: fromTime,
                  to: toTime
                },
                maxCloudCoverage: maxCloudCoverage
              },
              processing: {
                // Add any processing options here
              }
            }
          ]
        },
        output: {
          width: 512,
          height: 512,
          responses: [
            {
              identifier: 'default',
              format: {
                type: 'image/jpeg'
              }
            }
          ]
        }
      };

      // Make request to Sentinel Hub Process API
      const response = await fetch('https://services.sentinel-hub.com/api/v1/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub imagery request failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Process the result and return formatted satellite images
      // This is a simplified example - the actual response format depends on the API
      return this.formatSatelliteImages(result.data, bbox);
    } catch (error) {
      console.error('Error fetching satellite imagery:', error);
      throw error;
    }
  }

  /**
   * Calculate NDVI from satellite imagery
   */
  async calculateNDVI(
    bbox: [number, number, number, number],
    fromTime: string,
    toTime: string
  ): Promise<NDVIResult[]> {
    try {
      // Get access token
      const token = await this.getSentinelHubToken();

      // Define the request payload for NDVI calculation
      const requestBody = {
        input: {
          bounds: {
            bbox: bbox,
            properties: {
              crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84'
            }
          },
          data: [
            {
              type: 'sentinel-2-l2a',
              dataFilter: {
                timeRange: {
                  from: fromTime,
                  to: toTime
                },
                maxCloudCoverage: 20
              }
            }
          ]
        },
        output: {
          width: 512,
          height: 512,
          responses: [
            {
              identifier: 'ndvi',
              format: {
                type: 'application/json+image/tiff;depth=32f'
              }
            }
          ]
        },
        evalscript: `
          //VERSION=3
          function setup() {
            setInputComponents(["B04", "B08"]);
            setOutputFormat("JSON");
          }
          
          function evaluatePixel(sample) {
            let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
            return {ndvi: [ndvi]};
          }
        `
      };

      // Make request to Sentinel Hub Process API for NDVI
      const response = await fetch('https://services.sentinel-hub.com/api/v1/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub NDVI request failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Process the result and return NDVI values
      return this.formatNDVIResults(result.data);
    } catch (error) {
      console.error('Error calculating NDVI:', error);
      throw error;
    }
  }

  /**
   * Format satellite images data from API response
   */
  private formatSatelliteImages(data: any, bbox: [number, number, number, number]): SatelliteImage[] {
    // This is a simplified implementation - the actual format depends on the API response
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((item, index) => ({
      id: `image-${index}`,
      date: item.date || new Date().toISOString(),
      url: item.url || '',
      thumbnail: item.thumbnail || '',
      coordinates: {
        lat: (bbox[1] + bbox[3]) / 2, // Center latitude
        lng: (bbox[0] + bbox[2]) / 2  // Center longitude
      },
      metadata: {
        cloudCoverage: item.cloudCoverage || 0,
        sensor: 'Sentinel-2',
        resolution: 10 // meters
      }
    }));
  }

  /**
   * Format NDVI results from API response
   */
  private formatNDVIResults(data: any): NDVIResult[] {
    // This is a simplified implementation - the actual format depends on the API response
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((item, index) => ({
      date: item.date || new Date().toISOString(),
      ndviValue: item.ndvi || 0,
      imageUrl: item.url || ''
    }));
  }

  /**
   * Calculate the difference in NDVI between two dates to show vegetation improvement
   */
  async calculateNDVIDifference(
    bbox: [number, number, number, number],
    beforeTime: string,
    afterTime: string
  ): Promise<{ before: NDVIResult, after: NDVIResult, difference: number }> {
    try {
      const [beforeData, afterData] = await Promise.all([
        this.calculateNDVI(bbox, beforeTime, beforeTime),
        this.calculateNDVI(bbox, afterTime, afterTime)
      ]);

      const beforeNDVI = beforeData.length > 0 ? beforeData[0].ndviValue : 0;
      const afterNDVI = afterData.length > 0 ? afterData[0].ndviValue : 0;
      const difference = afterNDVI - beforeNDVI;

      return {
        before: beforeData.length > 0 ? beforeData[0] : { date: beforeTime, ndviValue: 0, imageUrl: '' },
        after: afterData.length > 0 ? afterData[0] : { date: afterTime, ndviValue: 0, imageUrl: '' },
        difference: difference
      };
    } catch (error) {
      console.error('Error calculating NDVI difference:', error);
      throw error;
    }
  }

  /**
   * Generate vegetation health assessment based on NDVI values
   */
  async assessVegetationHealth(plotId: string): Promise<{
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical',
    ndviValue: number,
    description: string,
    recommendations: string[]
  }> {
    try {
      // Get the latest NDVI for the plot
      const plotData = await this.getPlotData(plotId);
      if (plotData.ndviHistory.length === 0) {
        throw new Error('No NDVI data available for this plot');
      }

      // Get the most recent NDVI value
      const latestNDVI = plotData.ndviHistory[plotData.ndviHistory.length - 1];
      
      // Determine health status based on NDVI range
      let healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
      let description = '';
      let recommendations: string[] = [];

      if (latestNDVI.ndviValue > 0.8) {
        healthStatus = 'excellent';
        description = 'Excellent vegetation health with dense, healthy vegetation';
        recommendations = [
          'Maintain current management practices',
          'Continue regular monitoring',
          'Consider expanding successful practices to other areas'
        ];
      } else if (latestNDVI.ndviValue > 0.6) {
        healthStatus = 'good';
        description = 'Good vegetation health with adequate plant cover';
        recommendations = [
          'Continue monitoring and maintenance',
          'Consider water conservation practices during dry periods',
          'Monitor for potential pest or disease issues'
        ];
      } else if (latestNDVI.ndviValue > 0.4) {
        healthStatus = 'fair';
        description = 'Fair vegetation health, showing some stress';
        recommendations = [
          'Increase watering frequency',
          'Apply organic fertilizers',
          'Check for soil compaction or drainage issues',
          'Monitor for pests or diseases'
        ];
      } else if (latestNDVI.ndviValue > 0.2) {
        healthStatus = 'poor';
        description = 'Poor vegetation health requiring immediate attention';
        recommendations = [
          'Assess and address water availability',
          'Check soil pH and nutrient levels',
          'Consider replanting stressed areas',
          'Implement erosion control measures'
        ];
      } else {
        healthStatus = 'critical';
        description = 'Critical vegetation health, immediate intervention needed';
        recommendations = [
          'Emergency watering and soil amendments',
          'Evaluate and address root causes',
          'Consider reseeding or replanting',
          'Seek expert consultation'
        ];
      }

      return {
        healthStatus,
        ndviValue: latestNDVI.ndviValue,
        description,
        recommendations
      };
    } catch (error) {
      console.error('Error assessing vegetation health:', error);
      throw error;
    }
  }

  /**
   * Get historical NDVI trend for a plot
   */
  async getNDVITrend(plotId: string, days: number = 90): Promise<{
    average: number,
    trend: 'increasing' | 'decreasing' | 'stable',
    values: NDVIResult[]
  }> {
    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = now.toISOString().split('T')[0];
      
      // Get plot data with NDVI history
      const plotData = await this.getPlotData(plotId);
      
      if (plotData.ndviHistory.length === 0) {
        throw new Error('No NDVI data available for trend analysis');
      }
      
      // Calculate average NDVI
      const totalNDVI = plotData.ndviHistory.reduce((sum, record) => sum + record.ndviValue, 0);
      const average = totalNDVI / plotData.ndviHistory.length;
      
      // Determine trend by comparing first and last values
      const firstValue = plotData.ndviHistory[0].ndviValue;
      const lastValue = plotData.ndviHistory[plotData.ndviHistory.length - 1].ndviValue;
      
      let trend: 'increasing' | 'decreasing' | 'stable';
      if (lastValue > firstValue) {
        trend = 'increasing';
      } else if (lastValue < firstValue) {
        trend = 'decreasing';
      } else {
        trend = 'stable';
      }
      
      return {
        average,
        trend,
        values: plotData.ndviHistory
      };
    } catch (error) {
      console.error('Error getting NDVI trend:', error);
      throw error;
    }
  }

  /**
   * Get plot data with NDVI history
   */
  async getPlotData(plotId: string): Promise<PlotData> {
    // This would typically fetch plot coordinates and other data from your backend
    // For now, it's a placeholder that demonstrates how you might structure this
    
    // Example bounding box for a plot (in real app, this would come from your database)
    const bbox: [number, number, number, number] = [-122.4194, 37.7749, -122.4154, 37.7789]; // San Francisco example
    
    // Get recent NDVI data for the plot
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const fromTime = oneMonthAgo.toISOString().split('T')[0];
    const toTime = now.toISOString().split('T')[0];
    
    const ndviResults = await this.calculateNDVI(bbox, fromTime, toTime);
    
    return {
      id: plotId,
      name: `Plot ${plotId}`,
      coordinates: [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]], [bbox[0], bbox[1]]], // rectangle as example
      area: 0.5, // in hectares - would come from database
      ndviHistory: ndviResults,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get satellite imagery for a specific plot
   */
  async getPlotSatelliteImagery(plotId: string): Promise<SatelliteImage[]> {
    // This would typically fetch plot coordinates from your backend
    // For now, it's a placeholder that demonstrates how you might structure this
    
    // Example bounding box (in real app, this would come from your database)
    const bbox: [number, number, number, number] = [-122.4194, 37.7749, -122.4154, 37.7789]; // San Francisco example
    
    // Get recent imagery
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const fromTime = oneMonthAgo.toISOString().split('T')[0];
    const toTime = now.toISOString().split('T')[0];
    
    return this.getSatelliteImagery(bbox, fromTime, toTime);
  }
}

// Create and export a singleton instance
export const geospatialService = new GeospatialService();

// Export for use in components
export default GeospatialService;