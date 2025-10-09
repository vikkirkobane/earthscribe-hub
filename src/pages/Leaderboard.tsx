import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  Target,
  Sprout,
  Users,
  Calendar,
  Star,
  Medal,
  Award,
  MapPin,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Leaderboard = () => {
  const { user } = useAuth();

  // Mock data for leaderboard
  const leaderboardData = [
    { id: 1, name: "Sarah K.", points: 2450, rank: 1, location: "Nairobi", avatar: "SK", stats: { quests: 87, plots: 5, streak: 24 } },
    { id: 2, name: "James M.", points: 2320, rank: 2, location: "Mombasa", avatar: "JM", stats: { quests: 76, plots: 4, streak: 18 } },
    { id: 3, name: "Elena R.", points: 2180, rank: 3, location: "Kisumu", avatar: "ER", stats: { quests: 65, plots: 3, streak: 15 } },
    { id: 4, name: "Michael T.", points: 1950, rank: 4, location: "Nakuru", avatar: "MT", stats: { quests: 58, plots: 2, streak: 12 } },
    { id: 5, name: "Aisha O.", points: 1870, rank: 5, location: "Eldoret", avatar: "AO", stats: { quests: 62, plots: 3, streak: 20 } },
    { id: 6, name: user?.name || "You", points: 1250, rank: 12, location: "Your Location", avatar: "TG", stats: { quests: 42, plots: 3, streak: 12 }, isUser: true },
    { id: 7, name: "David L.", points: 1180, rank: 13, location: "Thika", avatar: "DL", stats: { quests: 45, plots: 2, streak: 8 } },
    { id: 8, name: "Fatima A.", points: 1090, rank: 14, location: "Malindi", avatar: "FA", stats: { quests: 38, plots: 1, streak: 7 } },
    { id: 9, name: "Robert K.", points: 980, rank: 15, location: "Bungoma", avatar: "RK", stats: { quests: 32, plots: 0, streak: 5 } },
    { id: 10, name: "Grace W.", points: 920, rank: 16, location: "Kitale", avatar: "GW", stats: { quests: 29, plots: 1, streak: 3 } },
  ];

  const timeFilters = [
    { id: 'all-time', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
    { id: 'daily', label: 'Today' },
  ];

  const [selectedFilter, setSelectedFilter] = useState('all-time');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among community land guardians</p>
      </div>

      {/* Time Filter */}
      <div className="flex flex-wrap gap-2">
        {timeFilters.map((filter) => (
          <Badge
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            className={`cursor-pointer ${selectedFilter === filter.id ? 'bg-primary' : ''}`}
            onClick={() => setSelectedFilter(filter.id)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{leaderboardData.length}</p>
              <p className="text-xs text-muted-foreground">Total Guardians</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user?.points || 1250}</p>
              <p className="text-xs text-muted-foreground">Your Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Medal className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">#{leaderboardData.find(u => u.isUser)?.rank || 12}</p>
              <p className="text-xs text-muted-foreground">Your Rank</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-emerald/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">Quests Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Community Rankings</CardTitle>
          <CardDescription>Top land guardians in your community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((user) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  user.isUser ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3 w-8/12">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                    user.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                    user.rank === 3 ? 'bg-amber-100 text-amber-800' : 
                    'bg-muted'
                  }`}>
                    {user.rank <= 3 ? (
                      <Trophy className={`h-5 w-5 ${
                        user.rank === 1 ? 'text-yellow-500' : 
                        user.rank === 2 ? 'text-gray-400' : 
                        'text-amber-600'
                      }`} />
                    ) : (
                      <span className="font-semibold">{user.rank}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="text-sm font-medium">{user.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${user.isUser ? 'text-primary font-bold' : ''}`}>
                        {user.name}
                        {user.isUser && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">You</span>}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {user.location}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-2/12 text-center">
                  <p className="font-semibold">{user.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
                
                <div className="w-2/12 text-center">
                  <p className="font-semibold">{user.stats.quests}</p>
                  <p className="text-xs text-muted-foreground">quests</p>
                </div>
                
                <div className="w-2/12 text-center">
                  <p className="font-semibold">{user.stats.streak}</p>
                  <p className="text-xs text-muted-foreground">day streak</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
          <CardDescription>How you compare to community averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Your Rank</div>
              <div className="text-xs text-success mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+2 from last week</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-success">42</div>
              <div className="text-sm text-muted-foreground">Quests Completed</div>
              <div className="text-xs text-muted-foreground mt-1">Avg: 35</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-accent">2450</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-xs text-muted-foreground mt-1">Avg: 1800</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;