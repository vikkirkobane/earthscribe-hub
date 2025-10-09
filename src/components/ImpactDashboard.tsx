import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Users, MapPin, TrendingUp, Award, Sprout } from "lucide-react";

const stats = [
  {
    icon: MapPin,
    title: "Hectares Restored",
    value: "524",
    unit: "ha",
    progress: 65,
    color: "success",
    change: "+12% this month"
  },
  {
    icon: Sprout,
    title: "CO₂ Sequestered",
    value: "52,400",
    unit: "tons",
    progress: 78,
    color: "accent",
    change: "+18% this month"
  },
  {
    icon: Users,
    title: "Active Guardians",
    value: "10,234",
    unit: "people",
    progress: 85,
    color: "sky",
    change: "+24% this month"
  },
  {
    icon: Award,
    title: "Quests Completed",
    value: "2.1M",
    unit: "tasks",
    progress: 92,
    color: "primary",
    change: "+31% this month"
  }
];

const milestones = [
  { title: "First Quest Completed", date: "Oct 2024", icon: Award },
  { title: "100 Hectares Milestone", date: "Nov 2024", icon: MapPin },
  { title: "1,000 Guardians Joined", date: "Dec 2024", icon: Users },
  { title: "Carbon Credit Pre-sale", date: "Jan 2025", icon: Leaf }
];

const ImpactDashboard = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4 border border-success/20">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Real-Time Impact Metrics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Community <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every quest completed, every plot restored—together we're creating measurable climate action
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10 text-${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-success font-medium">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Milestones Timeline */}
        <Card className="max-w-4xl mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Community Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-muted hover:border-primary/50 transition-all group"
                >
                  <div className="p-3 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <milestone.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImpactDashboard;
