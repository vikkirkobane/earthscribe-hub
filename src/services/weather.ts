// src/services/weather.ts

interface WeatherData {
  temperature: number; // in Celsius
  humidity: number;    // percentage
  precipitation: number; // in mm (last 24h)
  windSpeed: number;   // in km/h
  description: string; // weather condition description
  location: string;    // location name
  coordinates: {
    lat: number;
    lon: number;
  };
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key is not set in environment variables');
    }
  }

  /**
   * Get current weather data for a specific location
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    if (!this.apiKey) {
      console.error('OpenWeatherMap API key is not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        precipitation: this.getRainVolume(data),
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
        location: data.name,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Get current weather by city name
   */
  async getCurrentWeatherByCity(city: string): Promise<WeatherData | null> {
    if (!this.apiKey) {
      console.error('OpenWeatherMap API key is not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        precipitation: this.getRainVolume(data),
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
        location: data.name,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Get forecast data for a specific location
   */
  async getForecast(lat: number, lon: number, days: number = 5): Promise<any[]> {
    if (!this.apiKey) {
      console.error('OpenWeatherMap API key is not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Process forecast data to group by day and pick relevant information
      const dailyForecasts: any[] = [];
      const dailyData = new Map<string, any[]>();
      
      // Group forecast items by date
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData.has(date)) {
          dailyData.set(date, []);
        }
        dailyData.get(date)?.push(item);
      });
      
      // Process each day's data
      dailyData.forEach((dayData, date) => {
        // Get the first and last temperatures to calculate min/max
        const temps = dayData.map((item: any) => item.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        
        // Calculate total precipitation for the day
        const totalPrecip = dayData.reduce((sum, item) => {
          return sum + (item.rain?.['3h'] || 0);
        }, 0);
        
        dailyForecasts.push({
          date,
          minTemp: Math.round(minTemp),
          maxTemp: Math.round(maxTemp),
          precipitation: totalPrecip,
          description: dayData[0].weather[0].description,
          humidity: dayData[0].main.humidity,
          windSpeed: Math.round(dayData[0].wind.speed * 3.6), // Convert m/s to km/h
        });
      });
      
      // Return only the requested number of days
      return dailyForecasts.slice(0, days);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return [];
    }
  }

  /**
   * Helper method to get rain volume from API response
   */
  private getRainVolume(data: any): number {
    // Rain volume can be in 'rain.1h', 'rain.3h', or not present at all
    if (data.rain) {
      return data.rain['1h'] || data.rain['3h'] || 0;
    }
    return 0;
  }
}

// Create and export a singleton instance
export const weatherService = new WeatherService();

// Export the interface for type safety
export type { WeatherData };