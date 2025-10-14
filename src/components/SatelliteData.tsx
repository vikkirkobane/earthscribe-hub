import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Cloud, Image, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SatelliteImage, NDVIResult } from "@/services/geospatial";
import { useSatelliteImagery, useNDVIAnalysis } from "@/hooks/useGeospatial";

interface SatelliteImageViewerProps {
  bbox: [number, number, number, number];
  dateRange?: { from: string; to: string };
}

const SatelliteImageViewer = ({ bbox, dateRange }: SatelliteImageViewerProps) => {
  const { satelliteImages, isLoading, error, refresh } = useSatelliteImagery(bbox, dateRange);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Satellite Imagery</CardTitle>
          <CardDescription>Error loading satellite imagery: {error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refresh} variant="outline">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Satellite Imagery</CardTitle>
            <CardDescription>Recent satellite images for the selected area</CardDescription>
          </div>
          <Button onClick={refresh} variant="outline" size="sm" disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading satellite imagery...</p>
          </div>
        ) : satelliteImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No satellite imagery available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {satelliteImages.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <div className="bg-muted aspect-video flex items-center justify-center">
                  {/* In a real app, this would show the actual satellite image */}
                  <Image className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium truncate">{new Date(image.date).toLocaleDateString()}</h4>
                    <Badge variant="secondary" className="ml-2">
                      {image.metadata.sensor}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Cloud className="h-3 w-3 mr-1" />
                    <span>{image.metadata.cloudCoverage}% cloud cover</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(image.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface NDVIChartProps {
  ndviData: NDVIResult[];
}

const NDVIChart = ({ ndviData }: NDVIChartProps) => {
  if (ndviData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <TrendingUp className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No NDVI data available</p>
      </div>
    );
  }

  // Simple text-based visualization of NDVI data
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {ndviData.slice(0, 5).map((data, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              {new Date(data.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
            <div className="h-20 flex items-end justify-center">
              <div 
                className="w-full bg-green-500 rounded-t"
                style={{ height: `${Math.min(100, Math.max(5, data.ndviValue * 100))}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium mt-1">{data.ndviValue.toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">NDVI Range</span>
          <span className="text-sm font-medium">{Math.min(...ndviData.map(d => d.ndviValue)).toFixed(2)} - {Math.max(...ndviData.map(d => d.ndviValue)).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Low</span>
          <Progress value={50} className="flex-1" />
          <span className="text-sm">High</span>
        </div>
      </div>
    </div>
  );
};

interface NDVIAnalysisCardProps {
  plotId: string;
}

const NDVIAnalysisCard = ({ plotId }: NDVIAnalysisCardProps) => {
  const { 
    ndviData, 
    healthAssessment, 
    ndviTrend, 
    isLoading, 
    error, 
    refresh 
  } = useNDVIAnalysis(plotId);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NDVI Analysis</CardTitle>
          <CardDescription>Error loading NDVI analysis: {error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refresh} variant="outline">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>NDVI Analysis</CardTitle>
            <CardDescription>Vegetation health assessment based on satellite imagery</CardDescription>
          </div>
          <Button onClick={refresh} variant="outline" size="sm" disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">Analyzing vegetation health...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Health Assessment */}
            {healthAssessment && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    healthAssessment.healthStatus === 'excellent' ? 'bg-green-500' :
                    healthAssessment.healthStatus === 'good' ? 'bg-lime-500' :
                    healthAssessment.healthStatus === 'fair' ? 'bg-yellow-500' :
                    healthAssessment.healthStatus === 'poor' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <h3 className="font-semibold capitalize">{healthAssessment.healthStatus} Vegetation Health</h3>
                  <span className="ml-auto text-lg font-bold">{healthAssessment.ndviValue.toFixed(2)}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{healthAssessment.description}</p>
                
                {healthAssessment.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {healthAssessment.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* NDVI Trend */}
            {ndviTrend && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">NDVI Trend</h3>
                  <div className="flex items-center">
                    {ndviTrend.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : ndviTrend.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-500 mr-1" />
                    )}
                    <span className="capitalize">{ndviTrend.trend}</span>
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold">{ndviTrend.average.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Average NDVI</div>
                </div>
                
                <NDVIChart ndviData={ndviTrend.values} />
              </div>
            )}

            {/* NDVI Chart */}
            {ndviData.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Recent NDVI Values</h3>
                <NDVIChart ndviData={ndviData} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { SatelliteImageViewer, NDVIAnalysisCard };