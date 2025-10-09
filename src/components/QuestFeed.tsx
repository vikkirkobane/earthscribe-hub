import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Camera, Clock } from "lucide-react";

const quests = [
  {
    id: 1,
    title: "Soil Erosion Detection",
    description: "Document erosion patterns in degraded areas to identify intervention needs.",
    difficulty: "Easy",
    points: 50,
    radius: "5 km",
    type: "erosion",
    color: "earth"
  },
  {
    id: 2,
    title: "Crop Health Monitoring",
    description: "Assess vegetation health in agricultural plots and document pest damage.",
    difficulty: "Medium",
    points: 75,
    radius: "3 km",
    type: "crop",
    color: "success"
  },
  {
    id: 3,
    title: "Water Source Survey",
    description: "Map and assess quality of local water sources for restoration planning.",
    difficulty: "Easy",
    points: 60,
    radius: "10 km",
    type: "water",
    color: "sky"
  },
  {
    id: 4,
    title: "Native Vegetation Count",
    description: "Identify and count native plant species in regeneration zones.",
    difficulty: "Hard",
    points: 100,
    radius: "2 km",
    type: "vegetation",
    color: "accent"
  },
  {
    id: 5,
    title: "Degraded Land Assessment",
    description: "Survey barren or degraded areas suitable for restoration projects.",
    difficulty: "Medium",
    points: 80,
    radius: "8 km",
    type: "degraded",
    color: "primary"
  }
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-sky/10 text-sky border-sky/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20"
};

const QuestFeed = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Available <span className="text-gradient">Quests</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete monitoring tasks in your area, earn points, and contribute to land restoration efforts
          </p>
        </div>

        {/* Quest Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quests.map((quest) => (
            <Card 
              key={quest.id} 
              className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group overflow-hidden"
            >
              <div className={`h-2 gradient-${quest.color}`} />
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={`${difficultyColors[quest.difficulty]} border`}
                  >
                    {quest.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{quest.points}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {quest.title}
                </CardTitle>
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
                <Button variant="hero" className="w-full group-hover:shadow-lg">
                  <Camera className="w-4 h-4" />
                  Start Quest
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-2">
            View All Quests
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuestFeed;
