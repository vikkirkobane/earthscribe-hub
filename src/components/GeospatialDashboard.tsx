import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  RefreshCw, 
  Globe, 
  Leaf, 
  TrendingUp, 
  Cloud, 
  Image, 
  Eye,
  Settings
} from "lucide-react";
import { SatelliteImageViewer, NDVIAnalysisCard } from "./SatelliteData";
import { PlotData } from "@/services/geospatial";
import { usePlotData } from "@/hooks/useGeospatial";

interface GeospatialDashboardProps {
  plotId: string;
  bbox?: [number, number, number, number]; // Optional bbox, if not provided we'll get it from plot
}

const GeospatialDashboard = ({ plotId, bbox: providedBbox }: GeospatialDashboardProps) => {
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [selectedLayer, setSelectedLayer] = useState('rgb'); // rgb, ndvi, false-color
  const [loading, setLoading] = useState(false);
  
  // Use the provided bbox or get it from plot data
  const { plotData } = usePlotData(plotId);
  const bbox = providedBbox || (plotData ? [
    plotData.coordinates[0][0], // min longitude
    plotData.coordinates[0][1], // min latitude
    plotData.coordinates[2][0], // max longitude
    plotData.coordinates[2][1]  // max latitude
  ] as [number, number, number, number] : [0, 0, 0, 0]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Geospatial Dashboard
          </h1>
          <p className="text-muted-foreground">
            Satellite imagery and vegetation analysis for your restoration plots
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedLayer} onValueChange={setSelectedLayer}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rgb">RGB (True Color)</SelectItem>
              <SelectItem value="ndvi">NDVI (Vegetation Index)</SelectItem>
              <SelectItem value="false-color">False Color</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Plot Info Card */}
      {plotData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Plot Information
            </CardTitle>
            <CardDescription>
              Details about your restoration plot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Plot Name</div>
                <div className="font-medium">{plotData.name}</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Area</div>
                <div className="font-medium">{plotData.area} ha</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="font-medium">{new Date(plotData.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Satellite Imagery Section */}
      <SatelliteImageViewer 
        bbox={bbox} 
        dateRange={dateRange || undefined}
      />

      {/* NDVI Analysis Section */}
      <NDVIAnalysisCard plotId={plotId} />

      {/* Additional Geospatial Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Geospatial Insights</CardTitle>
          <CardDescription>Environmental metrics derived from satellite data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">0.68</div>
              <div className="text-sm text-muted-foreground">Avg. NDVI</div>
              <div className="text-xs mt-1 text-green-600">Healthy</div>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Cloud className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">12%</div>
              <div className="text-sm text-muted-foreground">Avg. Cloud Cover</div>
              <div className="text-xs mt-1 text-blue-600">Low</div>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">+0.12</div>
              <div className="text-sm text-muted-foreground">NDVI Improvement</div>
              <div className="text-xs mt-1 text-purple-600">Trend: Rising</div>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Image className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Images Available</div>
              <div className="text-xs mt-1 text-amber-600">Last 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeospatialDashboard;