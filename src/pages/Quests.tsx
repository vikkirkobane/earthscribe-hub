import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Camera, Clock, Trophy, Target, Leaf, Droplets, Mountain, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QuestDetails from "@/components/QuestDetails";

const Quests = () => {
  const { user } = useAuth();
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  // Mock data for quests
  const quests = [
    {
      id: 1,
      title: "Soil Erosion Detection",
      description: "Document erosion patterns in degraded areas to identify intervention needs.",
      difficulty: "Easy",
      points: 50,
      radius: "5 km",
      type: "erosion",
      color: "bg-amber-500",
      icon: Mountain,
      completed: false
    },
    {
      id: 2,
      title: "Crop Health Monitoring",
      description: "Assess vegetation health in agricultural plots and document pest damage.",
      difficulty: "Medium",
      points: 75,
      radius: "3 km",
      type: "crop",
      color: "bg-green-500",
      icon: Leaf,
      completed: true
    },
    {
      id: 3,
      title: "Water Source Survey",
      description: "Map and assess quality of local water sources for restoration planning.",
      difficulty: "Easy",
      points: 60,
      radius: "10 km",
      type: "water",
      color: "bg-blue-500",
      icon: Droplets,
      completed: false
    },
    {
      id: 4,
      title: "Native Vegetation Count",
      description: "Identify and count native plant species in regeneration zones.",
      difficulty: "Hard",
      points: 100,
      radius: "2 km",
      type: "vegetation",
      color: "bg-emerald-500",
      icon: Target,
      completed: false
    },
    {
      id: 5,
      title: "Degraded Land Assessment",
      description: "Survey barren or degraded areas suitable for restoration projects.",
      difficulty: "Medium",
      points: 80,
      radius: "8 km",
      type: "degraded",
      color: "bg-purple-500",
      icon: Trophy,
      completed: false
    }
  ];

  const difficultyColors: Record<string, string> = {
    Easy: "bg-success/10 text-success border-success/20",
    Medium: "bg-sky/10 text-sky border-sky/20",
    Hard: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const handleStartQuest = (quest: any) => {
    setSelectedQuest(quest);
  };

  const handleCloseQuestDetails = () => {
    setSelectedQuest(null);
  };

  const handleCompleteQuest = (questId: number, submission: any) => {
    console.log('Quest completed:', questId, submission);
    // In a real app, you would update the quest status in the backend
    // For now, just close the modal
    setSelectedQuest(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quests</h1>
        <p className="text-muted-foreground">Complete monitoring tasks in your area and earn points</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user?.points || 1250}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">Quests Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quest Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => {
          const Icon = quest.icon;
          return (
            <Card 
              key={quest.id} 
              className={`border-2 hover:border-primary/50 transition-all hover:shadow-xl group overflow-hidden ${
                quest.completed ? 'opacity-70' : ''
              }`}
            >
              <div className={`h-2 ${quest.color}`} />
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={`${difficultyColors[quest.difficulty]} border`}
                  >
                    {quest.difficulty}
                  </Badge>
                  {quest.completed && (
                    <Badge variant="secondary" className="bg-success/20">
                      Completed
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{quest.points}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${quest.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {quest.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-base mt-2">
                  {quest.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{quest.radius}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>10-15 min</span>
                  </div>
                </div>
                <Button 
                  variant="hero" 
                  className="w-full group-hover:shadow-lg"
                  disabled={quest.completed}
                  onClick={() => !quest.completed && handleStartQuest(quest)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {quest.completed ? 'Quest Completed' : 'Start Quest'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Button variant="outline" className="border-2">
          View All Quests
        </Button>
      </div>
      
      {selectedQuest && (
        <QuestDetails 
          quest={selectedQuest} 
          onClose={handleCloseQuestDetails} 
          onComplete={handleCompleteQuest} 
        />
      )}
    </div>
  );
};

export default Quests;