import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  X, 
  MapPin, 
  Camera, 
  Star, 
  Trophy, 
  Target,
  Leaf,
  Droplets,
  Mountain,
  Check,
  Upload,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface QuestDetailsProps {
  quest: any;
  onClose: () => void;
  onComplete: (questId: number, submission: any) => void;
}

const QuestDetails: React.FC<QuestDetailsProps> = ({ quest, onClose, onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: "Overview", icon: Trophy },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Documentation", icon: Camera },
    { number: 4, title: "Submission", icon: Check }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddImage = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
  };

  const handleRemoveImage = (index: number) => {
    if (imageUrls.length > 1) {
      const newImages = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newImages);
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 2 && !location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to submit the quest
    setTimeout(() => {
      const submission = {
        questId: quest.id,
        userId: user?.id,
        notes,
        images: imageUrls.filter(url => url.trim() !== ''),
        location,
        submittedAt: new Date().toISOString()
      };
      
      console.log('Submitting quest:', submission);
      alert(`Quest "${quest.title}" has been completed successfully! +${quest.points} points`);
      onComplete(quest.id, submission);
      setIsSubmitting(false);
    }, 1500);
  };

  // Get the icon component for the quest type
  const QuestIcon = quest.icon;

  // Component to handle map click events and get user location
  const LocationMapEvents = () => {
    useMapEvents({
      click: (e) => {
        // In a real app, you would reverse geocode the coordinates to get the location name
        setLocation(`(${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
      }
    });
    return null;
  };

  // Initialize with a default view
  const defaultCenter = [-1.2865, 36.8169]; // Nairobi coordinates as default
  const defaultZoom = 13;

  return (
    <Card className="fixed inset-4 z-50 m-4 flex flex-col max-h-[95vh]" role="dialog" aria-modal="true" aria-labelledby="quest-details-title">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle id="quest-details-title" className="text-lg flex items-center gap-2">
          <QuestIcon className="h-5 w-5" />
          {quest.title}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onClose} aria-label="Close quest details">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Progress indicator */}
        <div className="border-b p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Quest Progress</h3>
            <span className="text-sm text-muted-foreground">{currentStep} of {steps.length}</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div 
                key={step.number} 
                className={`flex flex-col items-center ${currentStep === step.number ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          {/* Step 1: Overview */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${quest.color}`}>
                  <QuestIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{quest.title}</h3>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                  <div className="font-semibold capitalize">{quest.difficulty}</div>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Reward</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    {quest.points} points
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Radius</div>
                  <div className="font-semibold">{quest.radius}</div>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-semibold">10-15 min</div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Instructions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Go to the specified area within {quest.radius}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Document the required information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Capture necessary images as evidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Submit your findings</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Click on map to select location or enter manually"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.location}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Click on the map to select your current location where you're completing this quest
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Quest Radius</h3>
                <p className="text-sm text-muted-foreground">
                  This quest is available within {quest.radius} of your current location
                </p>
                
                {/* Interactive map for location selection */}
                <div className="mt-4 rounded-lg overflow-hidden border h-64 relative">
                  <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMapEvents />
                  </MapContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your observations..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Additional information that might be helpful for verification
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Images</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                    Add Image
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Enter image URL or upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                        disabled={imageUrls.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id={`fileInput-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            alert(`File selected: ${file.name}. In a real app, this would upload the image and set its URL.`);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Add images as evidence of your quest completion
                </p>
              </div>
            </div>
          )}
          
          {/* Step 4: Submission */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4`}>
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Submit</h3>
                <p className="text-muted-foreground">
                  You're about to complete this quest and earn {quest.points} points
                </p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quest:</span>
                    <span className="font-medium">{quest.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Location:</span>
                    <span className="font-medium">{location || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Images submitted:</span>
                    <span className="font-medium">{imageUrls.filter(url => url.trim() !== '').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Points earned:</span>
                    <span className="font-medium text-green-600">+{quest.points}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Important</h4>
                    <p className="text-sm text-muted-foreground">
                      Make sure all information is correct before submitting. 
                      Inaccurate submissions may result in point deductions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Footer with navigation buttons */}
        <div className="border-t p-4 bg-card">
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={currentStep > 1 ? handlePrev : onClose}
              className="flex-1"
            >
              {currentStep > 1 ? 'Back' : 'Cancel'}
            </Button>
            
            {currentStep < 4 ? (
              <Button 
                type="button"
                className="flex-1"
                onClick={() => {
                  if (validateCurrentStep()) {
                    handleNext();
                  }
                }}
              >
                Continue
              </Button>
            ) : (
              <Button 
                type="button"
                className="flex-1"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  `Earn ${quest.points} Points`
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestDetails;