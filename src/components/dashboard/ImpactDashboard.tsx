import { useState, useEffect } from 'react';
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
  BarChart3,
  Award
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { getUserImpactSummary } from "@/services/api/impact";

const ImpactDashboard = () => {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpactData();
  }, [user]);

  const loadImpactData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // We would normally call the API here
      // For now, we'll use mock data
      const mockData = {
        totalHectares: 2.5,
        totalCo2Sequestered: 4.2,
        totalBiodiversity: 18,
        activePlots: 2,
        questsCompleted: 42,
        communityRank: 12,
        monthlyProgress: [
          { month: 'Jun', quests: 120, hectares: 0.3 },
          { month: 'Jul', quests: 180, hectares: 0.5 },
          { month: 'Aug', quests: 210, hectares: 0.7 },
          { month: 'Sep', quests: 250, hectares: 1.2 },
          { month: 'Oct', quests: 300, hectares: 2.5 },
        ],
        weeklyQuests: [
          { day: 'Mon', quests: 45 },
          { day: 'Tue', quests: 62 },
          { day: 'Wed', quests: 38 },
          { day: 'Thu', quests: 51 },
          { day: 'Fri', quests: 73 },
          { day: 'Sat', quests: 88 },
          { day: 'Sun', quests: 43 },
        ],
        plotProgress: [
          { name: 'Riverbank', hectares: 0.8, co2: 1.2 },
          { name: 'Garden', hectares: 0.5, co2: 0.7 },
          { name: 'Field', hectares: 1.2, co2: 2.3 },
        ]
      };
      
      setImpactData(mockData);
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Impact Dashboard</h1>
          <p className="text-muted-foreground">Loading your environmental impact data...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-muted rounded-full w-5 h-5 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-2 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!impactData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Impact Dashboard</h1>
          <p className="text-muted-foreground">Track your environmental contributions and community impact</p>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Impact Data</h3>
              <p className="text-muted-foreground">Complete your first quest or claim a plot to start tracking your impact.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="text-3xl font-bold">{impactData.totalHectares} ha</div>
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
            <div className="text-3xl font-bold">{impactData.totalCo2Sequestered}t</div>
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
            <div className="text-3xl font-bold">{impactData.totalBiodiversity}</div>
            <div className="mt-2">
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+3 species tracked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mountain className="h-5 w-5 text-purple-500" />
              Active Plots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impactData.activePlots}</div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">+1 this month</p>
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
            <div className="text-3xl font-bold">{impactData.questsCompleted}</div>
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
            <div className="text-3xl font-bold">#{impactData.communityRank}</div>
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
              <BarChart data={impactData.monthlyProgress}>
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
              <AreaChart data={impactData.weeklyQuests}>
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

      {/* Plot Impact Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plot Impact Comparison</CardTitle>
          <CardDescription>Environmental impact of your various restoration plots</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData.plotProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hectares" fill="#10b981" name="Hectares" />
              <Bar dataKey="co2" fill="#3b82f6" name="CO₂ (t)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Personal vs Community Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Your Quests</span>
                <span className="font-semibold">{impactData.questsCompleted}</span>
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
                <span className="font-semibold">{impactData.totalHectares} ha</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>CO₂ Sequestered</span>
                </div>
                <span className="font-semibold">{impactData.totalCo2Sequestered}t</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <span>Biodiversity Index</span>
                </div>
                <span className="font-semibold">{impactData.totalBiodiversity}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Achievements</CardTitle>
          <CardDescription>Badges earned for your environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mt-2">Land Restorer</h3>
              <p className="text-xs text-muted-foreground">Restored 2+ hectares</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-blue-500/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mt-2">Carbon Hero</h3>
              <p className="text-xs text-muted-foreground">Sequestered 4t CO₂</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-emerald-500/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Leaf className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold mt-2">Biodiversity Champion</h3>
              <p className="text-xs text-muted-foreground">Tracked 18 species</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-yellow-500/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold mt-2">Quest Master</h3>
              <p className="text-xs text-muted-foreground">Completed 42 quests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactDashboard;