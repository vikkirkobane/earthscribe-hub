import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Eye, Download, Layers, TrendingUp, Leaf } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  FeatureGroup
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

interface PlotMapProps {
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

// Mock function to get plot coordinates
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

// Component to handle map events
const MapClickHandler = ({ plot }: { plot: any }) => {
  useMapEvents({
    click: () => {
      // Handle map click events if needed
    }
  });
  return null;
};

const PlotMap: React.FC<PlotMapProps> = ({ plot, onClose }) => {
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'street'>('satellite');
  const [showNDVI, setShowNDVI] = useState(false);
  const plotCoords = getPlotCoordinates(plot.id);
  
  // Define tile layers based on view type
  const getTileLayer = () => {
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

  // Mock function to get NDVI data (in a real app, this would come from the geospatial service)
  const getNDVIOverlay = () => {
    // In a real implementation, this would fetch NDVI data from Sentinel Hub
    if (showNDVI) {
      // This would be the NDVI overlay URL in a real implementation
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

  return (
    <Card className="fixed inset-4 z-50 m-4 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="plot-map-title">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle id="plot-map-title" className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Plot Map: {plot.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // In a real app, this would download plot data
              console.log('Downloading plot data:', plot);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onClose} aria-label="Close map">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-56px)] p-0 flex flex-col">
        {/* Map Controls */}
        <div className="p-3 border-b flex flex-wrap items-center justify-between gap-2">
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
              <Leaf className="h-4 w-4 mr-2" />
              NDVI
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-muted-foreground">
              {plot.area} ha • {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">+0.12 NDVI</span>
            </div>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[plotCoords.lat, plotCoords.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url={getTileLayer()}
              attribution={
                mapView === 'satellite' 
                  ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />
            {getNDVIOverlay()}
            <Marker position={[plotCoords.lat, plotCoords.lng]}>
              <Popup>
                <div className="font-semibold">{plot.name}</div>
                <div className="text-sm">{plot.area} ha</div>
                <div className="text-sm">Status: {plot.status}</div>
                <div className="text-sm">CO₂: {plot.co2Sequestered}t</div>
              </Popup>
            </Marker>
            <MapClickHandler plot={plot} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlotMap;