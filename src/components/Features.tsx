import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Bot, BarChart3, Trophy, Map, Zap } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Gamified Quests",
    description: "Complete land monitoring tasks, capture photos, and earn points. Like Duolingo, but for land health.",
    color: "text-accent"
  },
  {
    icon: Bot,
    title: "AI Regeneration Advisor",
    description: "Get personalized, context-aware advice from Claude AI for your local conditions and restoration goals.",
    color: "text-sky"
  },
  {
    icon: Map,
    title: "Plot Management",
    description: "Claim degraded land, create restoration plans, and track your progress with satellite verification.",
    color: "text-earth"
  },
  {
    icon: BarChart3,
    title: "Impact Tracking",
    description: "Measure your environmental impact with NDVI analysis, CO₂ estimates, and biodiversity metrics.",
    color: "text-success"
  },
  {
    icon: Trophy,
    title: "Achievements & Badges",
    description: "Unlock rewards, climb leaderboards, and build your reputation as a land guardian.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Offline-First",
    description: "Work in the field without connectivity. Data syncs automatically when you're back online.",
    color: "text-secondary"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Powerful Tools</span> for Land Stewards
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to monitor, restore, and verify land regeneration—all in one platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
