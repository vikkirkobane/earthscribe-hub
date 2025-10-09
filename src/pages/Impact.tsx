import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  Sprout,
  TrendingUp,
  Users,
  Globe,
  Calendar,
  Trophy,
  Leaf,
  Droplets,
  Mountain,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";

const Impact = () => {
  const { user } = useAuth();

  // Mock data for impact metrics
  const impactMetrics = {
    hectaresRestored: 2.5,
    co2Sequestered: 4.2,
    biodiversityIndex: 18,
    activeGuardians: 847,
    questsCompleted: 2450,
    communityRank: 12
  };

  // Mock data for charts
  const monthlyProgress = [
    { month: 'Jun', quests: 120, hectares: 0.3 },
    { month: 'Jul', quests: 180, hectares: 0.5 },
    { month: 'Aug', quests: 210, hectares: 0.7 },
    { month: 'Sep', quests: 250, hectares: 1.2 },
    { month: 'Oct', quests: 300, hectares: 2.5 },
  ];

  const weeklyQuests = [
    { day: 'Mon', quests: 45 },
    { day: 'Tue', quests: 62 },
    { day: 'Wed', quests: 38 },
    { day: 'Thu', quests: 51 },
    { day: 'Fri', quests: 73 },
    { day: 'Sat', quests: 88 },
    { day: 'Sun', quests: 43 },
  ];

  const communityAchievements = [
    { id: 1, name: "Land Guardian", count: 125, percentage: 65 },
    { id: 2, name: "Eco Warrior", count: 45, percentage: 25 },
    { id: 3, name: "Restoration Hero", count: 8, percentage: 5 },
    { id: 4, name: "Streak Master", count: 67, percentage: 35 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Impact Dashboard</h1>
        <p className="text-muted-foreground">Track your environmental contributions and community impact</p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-500" />
              Hectares Restored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactMetrics.hectaresRestored} ha</div>
            <div className="mt-2">
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">65% of monthly goal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              CO₂ Sequestered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactMetrics.co2Sequestered}t</div>
            <div className="mt-2">
              <Progress value={80} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+0.5t this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Biodiversity Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactMetrics.biodiversityIndex}</div>
            <div className="mt-2">
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+3 species tracked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Active Guardians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactMetrics.activeGuardians}</div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+47 this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Quests Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactMetrics.questsCompleted}</div>
            <div className="mt-2">
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+300 this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-500" />
              Community Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#{impactMetrics.communityRank}</div>
            <div className="mt-2">
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Top 5% of communities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Quests completed and hectares restored over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="quests" fill="#3b82f6" name="Quests" />
                <Bar yAxisId="right" dataKey="hectares" fill="#10b981" name="Hectares" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Quests completed by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyQuests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="quests" stroke="#3b82f6" fill="#93c5fd" name="Quests" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Community Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Community Achievements</CardTitle>
          <CardDescription>Badges earned by community members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityAchievements.map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{achievement.name}</span>
                  </div>
                  <span className="font-semibold">{achievement.count}</span>
                </div>
                <Progress value={achievement.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal vs Community</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Your Quests</span>
                <span className="font-semibold">42</span>
              </div>
              <Progress value={70} className="h-3" />
              <div className="flex justify-between items-center">
                <span>Community Average</span>
                <span className="font-semibold">35</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-500" />
                  <span>Hectares Restored</span>
                </div>
                <span className="font-semibold">2.5 ha</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>CO₂ Sequestered</span>
                </div>
                <span className="font-semibold">4.2t</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <span>Biodiversity Index</span>
                </div>
                <span className="font-semibold">18</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Impact;