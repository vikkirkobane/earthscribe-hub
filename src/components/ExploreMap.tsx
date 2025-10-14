import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Eye, 
  Droplets, 
  Target,
  Leaf,
  Users,
  TrendingUp,
  Layers
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  FeatureGroup,
  LayersControl
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ExploreMapProps {
  plots: any[];
  onViewPlot: (plot: any) => void;
  onWaterManagement: (plot: any) => void;
}

// Mock function to get plot coordinates
const getPlotCoordinates = (plotId: number) => {
  // In a real app, this would come from your backend
  // For now, we'll use mock coordinates based on plot ID with some variation
  const baseLat = -1.2865;
  const baseLng = 36.8169;
  
  // Add some variation based on plot ID
  return {
    lat: baseLat + (plotId * 0.01),
    lng: baseLng + (plotId * 0.01)
  };
};

const ExploreMap: React.FC<ExploreMapProps> = ({ plots, onViewPlot, onWaterManagement }) => {
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'street'>('satellite');
  const [showNDVI, setShowNDVI] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  
  // Define tile layers based on view type
  const getBaseTileLayer = () => {
    switch (mapView) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'street':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };
  
  // NDVI overlay layer
  const NDVIOverlay = () => {
    if (showNDVI) {
      return (
        <TileLayer
          url="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/NDVI_VIIRS_300m/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg"
          opacity={0.6}
          attribution="NASA Global Imagery Browse Services for EOSDIS"
        />
      );
    }
    return null;
  };

  // Initialize with a default view
  const defaultCenter = [-1.2865, 36.8169]; // Nairobi coordinates
  const defaultZoom = 12;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <CardTitle>Explore Nearby Plots</CardTitle>
          <p className="text-sm text-muted-foreground">Discover and contribute to community restoration projects</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mapView === 'street' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('street')}
          >
            Street
          </Button>
          <Button
            variant={mapView === 'satellite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('satellite')}
          >
            Satellite
          </Button>
          <Button
            variant={mapView === 'terrain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('terrain')}
          >
            Terrain
          </Button>
          <Button
            variant={showNDVI ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowNDVI(!showNDVI)}
            disabled={mapView !== 'satellite'} // NDVI only makes sense on satellite view
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            NDVI
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden border h-[400px] sm:h-[500px] relative">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Street Map" checked={mapView === 'street'}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="Satellite Map" checked={mapView === 'satellite'}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="Terrain Map" checked={mapView === 'terrain'}>
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          {/* NDVI Overlay */}
          {showNDVI && (
            <TileLayer
              url="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/NDVI_VIIRS_300m/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg"
              opacity={0.6}
              attribution="NASA Global Imagery Browse Services for EOSDIS"
            />
          )}
          
          {/* Add markers for each plot */}
          {plots.map((plot) => {
            const coords = getPlotCoordinates(plot.id);
            
            return (
              <Marker key={plot.id} position={[coords.lat, coords.lng]}>
                <Popup>
                  <div className="font-semibold">{plot.name}</div>
                  <div className="text-sm">{plot.area} ha</div>
                  <div className="text-sm">Status: {plot.status}</div>
                  <div className="text-sm">{plot.location}</div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPlot(plot);
                        onViewPlot(plot);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onWaterManagement(plot)}
                    >
                      <Droplets className="h-3 w-3 mr-1" />
                      Water
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {/* Plot list below the map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plots.map((plot) => (
          <Card key={plot.id} className="overflow-hidden">
            <div className={`h-1 ${plot.status === 'active' ? 'bg-success' : plot.status === 'completed' ? 'bg-primary' : 'bg-muted'}`} />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{plot.name}</h3>
                <Badge 
                  variant={plot.status === 'active' ? 'default' : 'secondary'}
                  className={plot.status === 'active' ? 'bg-success text-success-foreground' : 'bg-primary'}
                >
                  {plot.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{plot.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{plot.degradationType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    <span>{plot.area} ha</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedPlot(plot);
                      onViewPlot(plot);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onWaterManagement(plot)}
                  >
                    <Droplets className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExploreMap;