import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, MapPin, Target, Droplets, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ClaimPlotFormProps {
  onClose: () => void;
}

const ClaimPlotForm: React.FC<ClaimPlotFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [plotName, setPlotName] = useState('');
  const [plotLocation, setPlotLocation] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [degradationType, setDegradationType] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!plotName.trim()) newErrors.plotName = 'Plot name is required';
    if (!plotLocation.trim()) newErrors.plotLocation = 'Location is required';
    if (!plotArea.trim()) newErrors.plotArea = 'Plot area is required';
    if (!degradationType) newErrors.degradationType = 'Degradation type is required';
    if (!accessibility) newErrors.accessibility = 'Accessibility information is required';
    
    const areaValue = parseFloat(plotArea);
    if (isNaN(areaValue) || areaValue <= 0) {
      newErrors.plotArea = 'Plot area must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call to claim the plot
    setTimeout(() => {
      console.log('Claiming plot with data:', {
        plotName,
        plotLocation,
        plotArea: parseFloat(plotArea),
        degradationType,
        accessibility,
        description,
        imageUrl,
        userId: user?.id,
        claimedDate: new Date().toISOString()
      });
      
      alert(`Plot "${plotName}" has been successfully claimed!`);
      setIsSubmitting(false);
      onClose(); // Close the form after successful submission
    }, 1500);
  };

  const degradationTypes = [
    'erosion', 'deforestation', 'water scarcity', 'soil degradation', 
    'desertification', 'overgrazing', 'pollution', 'other'
  ];

  const accessibilityOptions = [
    'easily accessible', 'moderate access', 'limited access', 'remote location'
  ];

  return (
    <Card className="fixed inset-4 z-50 m-4 flex flex-col max-h-[95vh]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Claim New Plot
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <div className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-6 h-full">
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="plotName">Plot Name</Label>
                  <Input
                    id="plotName"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    placeholder="Enter a name for your plot"
                  />
                  {errors.plotName && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.plotName}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plotLocation">Location</Label>
                  <Input
                    id="plotLocation"
                    value={plotLocation}
                    onChange={(e) => setPlotLocation(e.target.value)}
                    placeholder="Enter location or address"
                  />
                  {errors.plotLocation && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.plotLocation}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plotArea">Plot Area (hectares)</Label>
                    <Input
                      id="plotArea"
                      type="number"
                      value={plotArea}
                      onChange={(e) => setPlotArea(e.target.value)}
                      placeholder="0.0"
                    />
                    {errors.plotArea && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.plotArea}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="degradationType">Type of Degradation</Label>
                    <Select value={degradationType} onValueChange={setDegradationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degradation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {degradationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.degradationType && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.degradationType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Accessibility and Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access & Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="accessibility">Accessibility</Label>
                  <Select value={accessibility} onValueChange={setAccessibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="How accessible is this plot?" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessibilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.accessibility && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.accessibility}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the condition of the plot, any visible signs of degradation, and your restoration plans..."
                    rows={4}
                  />
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://image-url.com/image.jpg"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, you would upload the file and get a URL
                          // For this demo, we'll just alert the filename
                          alert(`File selected: ${file.name}. In a real app, this would upload the image and set its URL.`);
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload an image of the current plot condition
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        {/* Footer with buttons */}
        <div className="border-t p-4 bg-card">
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  Submitting...
                </>
              ) : (
                <>
                  Claim Plot
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClaimPlotForm;