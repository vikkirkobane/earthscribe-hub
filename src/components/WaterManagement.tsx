import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Droplets, 
  Calendar, 
  TrendingUp, 
  Sun, 
  CloudRain, 
  Wind,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { weatherService, WeatherData } from "@/services/weather";

interface WaterManagementProps {
  plot: {
    id: number;
    name: string;
    area: number;
    status: string;
    location: string;
    co2Sequestered: number;
    progress: number;
  };
  onClose: () => void;
}

const WaterManagement: React.FC<WaterManagementProps> = ({ plot, onClose }) => {
  const [waterAmount, setWaterAmount] = useState<string>('');
  const [irrigationMethod, setIrrigationMethod] = useState<string>('drip');
  const [schedule, setSchedule] = useState<string>('manual');
  const [notes, setNotes] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for water history and recommendations
  const waterHistory = [
    { date: new Date('2025-06-01'), amount: 250, method: 'drip', efficiency: 95 },
    { date: new Date('2025-06-05'), amount: 300, method: 'sprinkler', efficiency: 75 },
    { date: new Date('2025-06-10'), amount: 200, method: 'drip', efficiency: 92 },
    { date: new Date('2025-06-15'), amount: 180, method: 'drip', efficiency: 94 },
  ];

  const recommendations = [
    "Apply water during early morning to reduce evaporation",
    "Consider mulching to retain soil moisture",
    "Install soil moisture sensors for optimal irrigation scheduling"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting irrigation data:', { 
      plotId: plot.id, 
      waterAmount, 
      irrigationMethod, 
      schedule,
      notes 
    });
    
    // In a real app, this would make an API call to log the irrigation event
    alert(`Irrigation event recorded for ${plot.name}`);
    setWaterAmount('');
    setNotes('');
  };

  // Calculate water efficiency metrics
  const totalWaterApplied = waterHistory.reduce((sum, record) => sum + record.amount, 0);
  const avgEfficiency = waterHistory.reduce((sum, record) => sum + record.efficiency, 0) / waterHistory.length;
  
  // Get weather data for the plot location
  // Mock coordinates based on plot - in a real app these would come from the plot data
  const getPlotCoordinates = (plotId: number) => {
    // In a real app, this would come from your backend
    // For now, we'll use mock coordinates based on plot ID
    const coords: Record<number, { lat: number; lng: number }> = {
      1: { lat: -1.2921, lng: 36.8219 }, // Riverbank Restoration - near Nairobi
      2: { lat: -1.2842, lng: 36.8173 }, // Community Orchard
      3: { lat: -1.2765, lng: 36.8059 }, // Wetland Rehabilitation
    };
    
    return coords[plotId] || { lat: -1.2865, lng: 36.8169 }; // Default to Nairobi if not found
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoadingWeather(true);
      setError(null);
      
      try {
        const coords = getPlotCoordinates(plot.id);
        const data = await weatherService.getCurrentWeather(coords.lat, coords.lng);
        
        if (data) {
          setWeatherData(data);
        } else {
          setError('Failed to fetch weather data');
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data');
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, [plot.id, plot.name]);

  return (
    <Card className="fixed inset-4 z-50 m-4 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="water-management-title">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle id="water-management-title" className="text-lg flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Water Management: {plot.name}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onClose} aria-label="Close water management">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="h-[calc(100%-56px)] overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Log Irrigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waterAmount">Water Amount (L)</Label>
                    <Input
                      id="waterAmount"
                      type="number"
                      value={waterAmount}
                      onChange={(e) => setWaterAmount(e.target.value)}
                      placeholder="Enter water amount"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Irrigation Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['drip', 'sprinkler', 'flood', 'manual'].map((method) => (
                        <Button
                          key={method}
                          variant={irrigationMethod === method ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setIrrigationMethod(method);
                          }}
                          className="capitalize"
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['manual', 'daily', 'weekly'].map((sched) => (
                        <Button
                          key={sched}
                          variant={schedule === sched ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setSchedule(sched);
                          }}
                          className="capitalize"
                        >
                          {sched}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Droplets className="h-4 w-4 mr-2" />
                    Log Irrigation
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Current Weather</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingWeather ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {error}
                  </div>
                ) : weatherData ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Temp</div>
                          <div className="font-medium">{weatherData.temperature}°C</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Humidity</div>
                          <div className="font-medium">{weatherData.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-400" />
                        <div>
                          <div className="text-sm text-muted-foreground">Rain</div>
                          <div className="font-medium">{weatherData.precipitation}mm</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Wind</div>
                          <div className="font-medium">{weatherData.windSpeed} km/h</div>
                        </div>
                      </div>
                    </div>
                    
                    {weatherData.precipitation < 2 && (
                      <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-800">Low Precipitation</div>
                          <div className="text-yellow-700">Consider scheduling irrigation</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Weather data unavailable
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Middle and Right Columns - Water History and Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Water History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Total Water</p>
                    <p className="text-xl font-bold">{totalWaterApplied} L</p>
                  </div>
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
                    <p className="text-xl font-bold">{avgEfficiency?.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {waterHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{record.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-sm text-muted-foreground capitalize">{record.method} irrigation</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{record.amount} L</div>
                        <div className="text-sm text-muted-foreground">{record.efficiency}% efficient</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Water Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Tip {index + 1}</div>
                        <div className="text-green-700">{rec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterManagement;