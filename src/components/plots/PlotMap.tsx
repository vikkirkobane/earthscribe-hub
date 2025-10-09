import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Target, 
  Sprout, 
  Droplets, 
  Mountain, 
  Plus, 
  Calendar, 
  Upload,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Types for plot data
interface Plot {
  id: string;
  name: string;
  coordinates: any; // GeoJSON polygon
  area: number; // in hectares
  status: 'claimed' | 'planning' | 'active' | 'completed';
  degradationType: string;
  claimedAt: string;
  updatedAt: string;
  baselinePhoto?: string;
  restorationPlan?: string;
  co2Sequestered?: number;
}

const PlotMap = () => {
  const { user } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newPlotName, setNewPlotName] = useState('');
  const [newPlotDegradationType, setNewPlotDegradationType] = useState('');
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-1.2863, 36.8172]); // Nairobi as default
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);

  // Mock data for plots
  useEffect(() => {
    // In a real app, this would come from the API
    const mockPlots: Plot[] = [
      {
        id: '1',
        name: 'Riverbank Restoration',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [-1.28, 36.80],
            [-1.28, 36.81],
            [-1.29, 36.81],
            [-1.29, 36.80],
            [-1.28, 36.80]
          ]]
        },
        area: 2.5,
        status: 'active',
        degradationType: 'erosion',
        claimedAt: '2025-06-15',
        updatedAt: '2025-10-05',
        co2Sequestered: 1.2
      },
      {
        id: '2',
        name: 'Community Orchard',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [-1.27, 36.79],
            [-1.27, 36.80],
            [-1.28, 36.80],
            [-1.28, 36.79],
            [-1.27, 36.79]
          ]]
        },
        area: 1.8,
        status: 'planning',
        degradationType: 'deforestation',
        claimedAt: '2025-09-20',
        updatedAt: '2025-09-25'
      },
      {
        id: '3',
        name: 'Wetland Rehabilitation',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [-1.30, 36.81],
            [-1.30, 36.82],
            [-1.31, 36.82],
            [-1.31, 36.81],
            [-1.30, 36.81]
          ]]
        },
        area: 0.9,
        status: 'completed',
        degradationType: 'water scarcity',
        claimedAt: '2024-05-10',
        updatedAt: '2025-04-22',
        co2Sequestered: 0.8
      }
    ];
    setPlots(mockPlots);
  }, []);

  // Handle when user starts drawing a new plot
  const handleDrawStart = () => {
    setIsDrawing(true);
    setSelectedPlot(null);
  };

  // Handle when user finishes drawing
  const handleDrawStop = (e: any) => {
    setIsDrawing(false);
    
    // Extract coordinates from the drawn shape
    const layer = e.layer;
    const coordinates = layer.toGeoJSON();
    
    // Calculate area (in a real app, use turf.js or similar)
    // For now, we'll use a mock calculation
    const area = calculateArea(coordinates);
    
    // Create temporary plot for form
    const newPlot: Plot = {
      id: `temp-${Date.now()}`,
      name: '',
      coordinates,
      area,
      status: 'planning',
      degradationType: '',
      claimedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSelectedPlot(newPlot);
  };

  // Simple area calculation (in a real app, use turf.js)
  const calculateArea = (coordinates: any): number => {
    // This is a very simplified area calculation
    // In a real app, use a proper geographic library
    return Math.random() * 5; // Random area between 0-5 hectares for demo
  };

  // Handle form submission for new plot
  const handleNewPlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlot || !newPlotName || !newPlotDegradationType) return;
    
    const newPlot: Plot = {
      ...selectedPlot,
      name: newPlotName,
      degradationType: newPlotDegradationType,
    };
    
    setPlots([...plots, newPlot]);
    setSelectedPlot(null);
    setNewPlotName('');
    setNewPlotDegradationType('');
  };

  // Get user's location if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a location if geolocation fails
        }
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Plots</h1>
        <p className="text-muted-foreground">Manage your land restoration projects</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{plots.length}</p>
              <p className="text-xs text-muted-foreground">Total Plots</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {plots.reduce((sum, plot) => sum + (plot.area || 0), 0).toFixed(1)} ha
              </p>
              <p className="text-xs text-muted-foreground">Total Area</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Droplets className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {plots.filter(p => p.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Plots</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-emerald/10 p-2 rounded-lg">
              <Mountain className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {plots.reduce((sum, plot) => sum + (plot.co2Sequestered || 0), 0).toFixed(1)}t
              </p>
              <p className="text-xs text-muted-foreground">CO₂ Sequestered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Plot List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plot List */}
        <div className="lg:order-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Plots</CardTitle>
              <CardDescription>Manage your restoration projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plots.map(plot => (
                  <div 
                    key={plot.id} 
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                      selectedPlot?.id === plot.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedPlot(plot)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{plot.name || 'Unnamed Plot'}</h3>
                        <p className="text-sm text-muted-foreground">{plot.area.toFixed(2)} ha</p>
                      </div>
                      <Badge 
                        variant={plot.status === 'active' ? 'default' : 
                                plot.status === 'completed' ? 'secondary' : 'outline'}
                        className={
                          plot.status === 'active' ? 'bg-success text-success-foreground' : 
                          plot.status === 'completed' ? 'bg-primary' : 'bg-muted'
                        }
                      >
                        {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plot.degradationType.replace('_', ' ')}</p>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleDrawStart}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Claim New Plot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Plot Map</CardTitle>
              <CardDescription>View and manage your restoration plots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-lg overflow-hidden">
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={setMapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {plots.map(plot => (
                    <FeatureGroup key={plot.id}>
                      {/* Render the polygon */}
                      <div 
                        className="hidden" 
                        ref={(el) => {
                          if (el && mapRef) {
                            // In a real implementation, we would add the polygon to the map
                            // This is simplified for the example
                          }
                        }}
                      />
                    </FeatureGroup>
                  ))}
                  
                  {/* Drawing tools when in drawing mode */}
                  {isDrawing && (
                    <FeatureGroup>
                      <EditControl
                        position="topright"
                        onCreated={handleDrawStop}
                        draw={{
                          polyline: false,
                          rectangle: true,
                          circle: false,
                          marker: false,
                          circlemarker: false
                        }}
                      />
                    </FeatureGroup>
                  )}
                  
                  {/* User location marker */}
                  <Marker position={mapCenter}>
                    <Popup>You are here</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Plot Form - Appears when drawing is complete */}
      {selectedPlot && !selectedPlot.name && (
        <Card>
          <CardHeader>
            <CardTitle>Claim New Plot</CardTitle>
            <CardDescription>Define your restoration project details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewPlotSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plotName">Plot Name</Label>
                <Input
                  id="plotName"
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  placeholder="e.g., Home Garden Restoration"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degradationType">Degradation Type</Label>
                <select
                  id="degradationType"
                  value={newPlotDegradationType}
                  onChange={(e) => setNewPlotDegradationType(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Select type</option>
                  <option value="soil_erosion">Soil Erosion</option>
                  <option value="water_scarcity">Water Scarcity</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="desertification">Desertification</option>
                  <option value="pollution">Pollution</option>
                  <option value="overgrazing">Overgrazing</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Plot Area</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium">{selectedPlot.area.toFixed(2)} hectares</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Target className="h-4 w-4 mr-2" />
                  Claim Plot
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPlot(null);
                    setNewPlotName('');
                    setNewPlotDegradationType('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plot Detail View - Appears when a plot is selected */}
      {selectedPlot && selectedPlot.name && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedPlot.name}</CardTitle>
            <CardDescription>{selectedPlot.degradationType.replace('_', ' ')} restoration project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="text-xl font-bold">{selectedPlot.area} ha</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-xl font-bold capitalize">{selectedPlot.status}</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">CO₂ Sequestered</p>
                    <p className="text-xl font-bold">{selectedPlot.co2Sequestered || 0}t</p>
                  </div>
                  <div className="bg-success/10 p-3 rounded-full">
                    <Sprout className="h-5 w-5 text-success" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Planted Species</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                  <div className="bg-emerald/10 p-3 rounded-full">
                    <Droplets className="h-5 w-5 text-emerald" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Restoration Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {selectedPlot.restorationPlan || 'No plan added yet. Start by adding your first restoration activities.'}
                    </p>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Progress
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlotMap;