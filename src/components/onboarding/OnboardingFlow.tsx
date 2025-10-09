import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Target, 
  Bot, 
  MapPin, 
  Trophy,
  Calendar,
  CheckCircle,
  User,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  
  const steps = [
    {
      title: "Welcome to TerraGuardian!",
      subtitle: "Where Community Observations Meet AI Intelligence for Climate Action",
      icon: <Sprout className="h-12 w-12 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg">
            Transform your passion for the environment into measurable impact.
          </p>
          <p className="text-muted-foreground">
            TerraGuardian helps you monitor, understand, and restore your local environment through 
            gamified quests and AI-powered advice.
          </p>
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Three simple steps to environmental stewardship",
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Complete Land Monitoring Quests</h3>
              <p className="text-sm text-muted-foreground">
                Take photos of land conditions to document erosion, crop health, water sources, and more
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Get AI-Powered Advice</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized recommendations for land restoration based on your local conditions
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Track Your Impact</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your contributions to land restoration and carbon sequestration
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tell Us About Your Interests",
      subtitle: "Select what matters most to you",
      content: (
        <div className="space-y-4">
          <p className="text-center">Help us customize your experience</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'farming', label: 'Sustainable Farming', icon: <Sprout className="h-4 w-4" /> },
              { id: 'reforestation', label: 'Reforestation', icon: <Target className="h-4 w-4" /> },
              { id: 'water', label: 'Water Conservation', icon: <Bot className="h-4 w-4" /> },
              { id: 'soil', label: 'Soil Health', icon: <MapPin className="h-4 w-4" /> },
              { id: 'erosion', label: 'Erosion Control', icon: <Trophy className="h-4 w-4" /> },
              { id: 'biodiversity', label: 'Biodiversity', icon: <Calendar className="h-4 w-4" /> }
            ].map((interest) => (
              <Button
                key={interest.id}
                variant={interests.includes(interest.id) ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  if (interests.includes(interest.id)) {
                    setInterests(interests.filter(i => i !== interest.id));
                  } else {
                    setInterests([...interests, interest.id]);
                  }
                }}
              >
                {interest.icon}
                <span className="ml-2">{interest.label}</span>
                {interests.includes(interest.id) && (
                  <CheckCircle className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Your Impact Journey",
      subtitle: "See how you'll make a difference",
      content: (
        <div className="space-y-4">
          <div className="bg-accent/20 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Earn Points & Badges
            </h3>
            <p className="text-sm text-muted-foreground">
              Complete quests to earn points and achieve badges that recognize your environmental stewardship
            </p>
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-blue-500" />
              AI-Powered Guidance
            </h3>
            <p className="text-sm text-muted-foreground">
              Get personalized advice from our AI advisor based on your location and land conditions
            </p>
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Sprout className="h-5 w-5 text-green-500" />
              Track Real Impact
            </h3>
            <p className="text-sm text-muted-foreground">
              Monitor your contribution to land restoration, carbon sequestration, and biodiversity
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      subtitle: "Begin your land stewardship journey",
      icon: <User className="h-12 w-12 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg">
            You're now ready to start making a difference in your community!
          </p>
          <p className="text-muted-foreground">
            Complete your first quest to begin your environmental stewardship journey.
          </p>
          
          <div className="bg-primary/5 p-4 rounded-lg mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Pro Tip
            </h3>
            <p className="text-sm mt-2">
              Start with nearby quests to familiarize yourself with the process. 
              Our AI advisor is here to help with any questions!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Finish onboarding
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {steps[step].icon || <Sprout className="h-12 w-12 text-primary" />}
          </div>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].subtitle}</CardDescription>
          
          <div className="mt-6">
            <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          {steps[step].content}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
          >
            {step === steps.length - 1 ? 'Start Exploring' : 'Next'}
            {step !== steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;