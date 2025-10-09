import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy,
  Star,
  Award,
  Sprout,
  Target
} from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useAuth } from "@/contexts/AuthContext";
import { validateWithDefaultModel, initializeTensorFlow } from "@/services/tensorflow";
import { submitQuestWithValidation } from "@/services/api/submissions";
import { Quest } from "@/services/api/quests";

interface QuestSubmissionProps {
  quest: Quest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const QuestSubmission = ({ quest, open, onOpenChange, onSuccess, onError }: QuestSubmissionProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'camera' | 'preview' | 'validating' | 'result'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { videoRef, canvasRef, startCamera, stopCamera, capturePhoto, isCameraActive } = useCamera();

  // Initialize TensorFlow when component mounts
  useEffect(() => {
    initializeTensorFlow();
  }, []);

  // Get user location (simplified - in real app you'd request permission)
  useEffect(() => {
    if (navigator.geolocation && open && step === 'camera') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Continue without location
        }
      );
    }
  }, [open, step]);

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedImage(photo);
      setStep('preview');
    } else {
      onError('Failed to capture photo. Please try again.');
    }
  };

  const handleRetake = () => {
    setStep('camera');
    setCapturedImage(null);
  };

  const handleValidate = async () => {
    if (!user || !capturedImage) return;

    setLoading(true);
    setStep('validating');

    try {
      // In a real implementation, we would pass the image to TensorFlow for validation
      // For now, using the mock validation function
      const result = await validateWithDefaultModel(capturedImage, quest.type as any);
      
      setValidationResult(result);
      
      if (result.validated) {
        // Submit the quest with validation result
        const submissionResult = await submitQuestWithValidation(
          user.id,
          quest.id,
          capturedImage, // In a real app, you'd upload the image to storage
          location || undefined,
          result
        );
        
        setPointsEarned(submissionResult.pointsEarned);
        setBadgesEarned(submissionResult.badgesEarned);
        setStep('result');
      } else {
        setStep('result');
      }
    } catch (error) {
      console.error('Validation error:', error);
      onError(error instanceof Error ? error.message : 'Validation failed. Please try again.');
      setStep('camera');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onSuccess();
    onOpenChange(false);
    // Reset state
    setStep('camera');
    setCapturedImage(null);
    setValidationResult(null);
    setPointsEarned(0);
    setBadgesEarned([]);
    setLocation(null);
  };

  // Start/stop camera based on step
  useEffect(() => {
    if (open && step === 'camera') {
      startCamera();
    } else if (step !== 'camera') {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, step]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Complete Quest: {quest.title}</DialogTitle>
          <DialogDescription>
            {quest.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4">
          {step === 'camera' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Capture Evidence
                  </CardTitle>
                  <CardDescription>
                    Take a photo that demonstrates the quest requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    {isCameraActive ? (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p>Starting camera...</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleCapture}
                    size="lg"
                    className="w-full"
                  >
                    Capture Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {step === 'preview' && capturedImage && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Your Photo</CardTitle>
                  <CardDescription>
                    Make sure your photo clearly shows the required elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    <img 
                      src={capturedImage} 
                      alt="Captured evidence" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={handleRetake}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button 
                      onClick={handleValidate}
                      className="flex-1"
                    >
                      Validate & Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {step === 'validating' && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="items-center">
                  <CardTitle className="text-lg">Validating Your Submission</CardTitle>
                  <CardDescription>
                    AI is analyzing your photo to verify quest completion
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-full mb-4">
                    <Progress value={loading ? 100 : 0} className="h-3" />
                  </div>
                  
                  {capturedImage && (
                    <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                      <img 
                        src={capturedImage} 
                        alt="Captured evidence" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-center text-muted-foreground">
                    Our AI is checking if your photo meets the quest requirements...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {step === 'result' && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    validationResult?.validated ? 'bg-success/20' : 'bg-destructive/20'
                  }`}>
                    {validationResult?.validated ? (
                      <CheckCircle className="h-8 w-8 text-success" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-center">
                    {validationResult?.validated ? 'Quest Completed!' : 'Validation Failed'}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {validationResult?.validated 
                      ? 'Your submission was successfully validated' 
                      : 'Your submission did not meet the requirements'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {capturedImage && (
                    <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={capturedImage} 
                        alt="Captured evidence" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {validationResult?.validated && pointsEarned > 0 && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-accent rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">+{pointsEarned} Points</span>
                    </div>
                  )}
                  
                  {badgesEarned.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        New Badges Earned!
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {badgesEarned.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {validationResult && (
                    <div className="text-sm text-muted-foreground">
                      <p>Confidence: {(validationResult.confidence * 100).toFixed(1)}%</p>
                      <p>Identified: {validationResult.class.replace('_', ' ')}</p>
                    </div>
                  )}
                  
                  <Button onClick={handleComplete} className="w-full">
                    {validationResult?.validated ? 'Great Job!' : 'Try Again'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestSubmission;