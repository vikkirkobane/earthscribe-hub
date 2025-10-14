import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Leaf, 
  Sprout, 
  Calendar, 
  MapPin,
  Users,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const stats = {
    points: user?.points || 1250,
    streak: user?.streak_days || 12,
    questsCompleted: 42,
    plotsManaged: 3,
    communityRank: 12,
    totalGuardians: 847,
  };

  const recentActivities = [
    { id: 1, action: "Completed quest", title: "Soil Erosion Detection", date: "2 hours ago", points: 50 },
    { id: 2, action: "Claimed plot", title: "Degraded land restoration", date: "1 day ago", points: 0 },
    { id: 3, action: "Earned badge", title: "Streak Master", date: "2 days ago", points: 0 },
    { id: 4, action: "Completed quest", title: "Crop Health Monitoring", date: "3 days ago", points: 75 },
  ];

  const questTypes = [
    { id: 1, name: "Soil Erosion", completed: 12, total: 15, color: "bg-amber-500" },
    { id: 2, name: "Crop Health", completed: 8, total: 10, color: "bg-green-500" },
    { id: 3, name: "Water Source", completed: 5, total: 8, color: "bg-blue-500" },
    { id: 4, name: "Vegetation", completed: 10, total: 12, color: "bg-emerald-500" },
    { id: 5, name: "Degraded Land", completed: 7, total: 10, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || user?.email?.split('@')[0]}! Your land stewardship journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.points}</div>
            <p className="text-xs text-muted-foreground">+120 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quests Completed</CardTitle>
            <Sprout className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questsCompleted}</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{stats.communityRank}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalGuardians} guardians</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Quest Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {activity.action.includes("Completed") && <Trophy className="h-4 w-4 text-primary" />}
                    {activity.action.includes("Claimed") && <MapPin className="h-4 w-4 text-primary" />}
                    {activity.action.includes("Earned") && <Trophy className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}: {activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  {activity.points > 0 && (
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">+{activity.points}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quest Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Quest Progress</CardTitle>
            <CardDescription>Track your quest completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questTypes.map((quest) => (
                <div key={quest.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{quest.name}</span>
                    <span className="text-sm text-muted-foreground">{quest.completed}/{quest.total}</span>
                  </div>
                  <Progress value={(quest.completed / quest.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>The positive change you're creating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">2.5 ha</div>
              <div className="text-sm text-muted-foreground">Land Restored</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+0.3 ha this month</span>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">4.2t</div>
              <div className="text-sm text-muted-foreground">CO₂ Sequestered</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+0.5t this month</span>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">18</div>
              <div className="text-sm text-muted-foreground">Species Tracked</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+3 this month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/quests">
          <Button variant="hero" size="lg" className="h-24 w-full flex items-center justify-start px-6">
            <Trophy className="h-6 w-6 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Start a Quest</div>
              <div className="text-sm opacity-80">Complete land monitoring task</div>
            </div>
          </Button>
        </Link>
        
        <Link to="/ai-advisor">
          <Button variant="outline" size="lg" className="h-24 w-full border-2 flex items-center justify-start px-6">
            <Leaf className="h-6 w-6 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Chat with AI</div>
              <div className="text-sm opacity-80">Get regeneration advice</div>
            </div>
          </Button>
        </Link>
        
        <Link to="/plots">
          <Button variant="outline" size="lg" className="h-24 w-full border-2 flex items-center justify-start px-6">
            <MapPin className="h-6 w-6 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Manage Plots</div>
              <div className="text-sm opacity-80">Track restoration progress</div>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;