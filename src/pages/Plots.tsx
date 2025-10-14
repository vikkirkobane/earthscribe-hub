import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Target,
  Sprout,
  Droplets,
  Mountain,
  Plus,
  BarChart3,
  TrendingUp,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PlotMap from "@/components/PlotMap";
import WaterManagement from "@/components/WaterManagement";
import ClaimPlotForm from "@/components/ClaimPlotForm";
import ExploreMap from "@/components/ExploreMap";

const Plots = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-plots");
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  const [waterManagementPlot, setWaterManagementPlot] = useState<any>(null);
  const [showClaimForm, setShowClaimForm] = useState<boolean>(false);

  // Mock data for plots
  const plots = [
    {
      id: 1,
      name: "Riverbank Restoration",
      area: 2.5,
      status: "active",
      progress: 65,
      degradationType: "erosion",
      startDate: "2025-06-15",
      endDate: "2025-12-31",
      location: "Near village well",
      updates: 12,
      co2Sequestered: 2.1
    },
    {
      id: 2,
      name: "Community Orchard",
      area: 1.8,
      status: "planning",
      progress: 15,
      degradationType: "deforestation",
      startDate: "2025-09-20",
      endDate: "2026-03-15",
      location: "East of village",
      updates: 3,
      co2Sequestered: 0.0
    },
    {
      id: 3,
      name: "Wetland Rehabilitation",
      area: 0.9,
      status: "completed",
      progress: 100,
      degradationType: "water scarcity",
      startDate: "2024-05-10",
      endDate: "2025-04-22",
      location: "North of village",
      updates: 28,
      co2Sequestered: 1.8
    }
  ];

  const handleViewPlot = (plot: any) => {
    setSelectedPlot(plot);
  };

  const handleCloseMap = () => {
    setSelectedPlot(null);
  };

  const handleWaterManagement = (plot: any) => {
    setWaterManagementPlot(plot);
  };

  const handleCloseWaterManagement = () => {
    setWaterManagementPlot(null);
  };

  const handleClaimPlot = () => {
    setShowClaimForm(true);
  };

  const handleCloseClaimForm = () => {
    setShowClaimForm(false);
  };

  const mapData = {
    bounds: {
      northEast: { lat: -1.28, lng: 36.82 },
      southWest: { lat: -1.32, lng: 36.78 }
    },
    plots: [
      { id: 1, center: { lat: -1.29, lng: 36.80 }, status: "active", area: 2.5 },
      { id: 2, center: { lat: -1.30, lng: 36.79 }, status: "planning", area: 1.8 },
      { id: 3, center: { lat: -1.31, lng: 36.81 }, status: "completed", area: 0.9 }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Plots</h1>
        <p className="text-muted-foreground">Manage your land restoration projects and track progress</p>
      </div>

      {/* Stats Cards */}
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
              <p className="text-2xl font-bold">4.2 ha</p>
              <p className="text-xs text-muted-foreground">Total Area</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">1.8t</p>
              <p className="text-xs text-muted-foreground">CO₂ Sequestered</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-emerald/10 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Active Plots</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for navigation */}
      <div className="flex border-b">
        <Button
          variant="ghost"
          className={`px-4 py-2 ${activeTab === 'my-plots' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('my-plots')}
        >
          My Plots
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 ${activeTab === 'explore' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          Explore
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
      </div>

      {activeTab === 'my-plots' && (
        <div className="space-y-6">
          {/* Add New Plot Button */}
          <div className="flex justify-end">
            <Button onClick={handleClaimPlot}>
              <Plus className="h-4 w-4 mr-2" />
              Claim New Plot
            </Button>
          </div>

          {/* Plot List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plots.map((plot) => (
              <Card key={plot.id} className="overflow-hidden">
                <div className={`h-2 ${
                  plot.status === 'active' ? 'bg-success' : 
                  plot.status === 'completed' ? 'bg-primary' : 'bg-muted'
                }`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plot.name}</CardTitle>
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
                  <CardDescription>{plot.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{plot.area} ha</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{plot.degradationType.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{plot.progress}%</span>
                      </div>
                      <Progress value={plot.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(plot.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{plot.co2Sequestered}t CO₂</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewPlot(plot)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleWaterManagement(plot)}
                      >
                        <Droplets className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <Card>
          <CardContent className="p-4">
            <ExploreMap 
              plots={plots} 
              onViewPlot={handleViewPlot} 
              onWaterManagement={handleWaterManagement} 
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Restoration History</CardTitle>
            <CardDescription>Your completed restoration projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Wetland Rehabilitation</h3>
                  <p className="text-sm text-muted-foreground">Completed on April 22, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">0.9 ha</p>
                  <p className="text-sm text-muted-foreground">1.8t CO₂</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedPlot && (
        <PlotMap 
          plot={selectedPlot} 
          onClose={handleCloseMap} 
        />
      )}
      
      {waterManagementPlot && (
        <WaterManagement 
          plot={waterManagementPlot} 
          onClose={handleCloseWaterManagement} 
        />
      )}
      
      {showClaimForm && (
        <ClaimPlotForm 
          onClose={handleCloseClaimForm} 
        />
      )}
    </div>
  );
};

export default Plots;