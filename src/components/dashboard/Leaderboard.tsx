import { useState, useEffect } from 'react';
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
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for leaderboard
const mockLeaderboardData = [
  { id: 1, name: "Sarah K.", points: 2450, rank: 1, location: "Nairobi", avatar: "SK", stats: { quests: 87, plots: 5, streak: 24 } },
  { id: 2, name: "James M.", points: 2320, rank: 2, location: "Mombasa", avatar: "JM", stats: { quests: 76, plots: 4, streak: 18 } },
  { id: 3, name: "Elena R.", points: 2180, rank: 3, location: "Kisumu", avatar: "ER", stats: { quests: 65, plots: 3, streak: 15 } },
  { id: 4, name: "Michael T.", points: 1950, rank: 4, location: "Nakuru", avatar: "MT", stats: { quests: 58, plots: 2, streak: 12 } },
  { id: 5, name: "Aisha O.", points: 1870, rank: 5, location: "Eldoret", avatar: "AO", stats: { quests: 62, plots: 3, streak: 20 } },
  { id: 6, name: "David L.", points: 1180, rank: 13, location: "Thika", avatar: "DL", stats: { quests: 45, plots: 2, streak: 8 } },
  { id: 7, name: "Fatima A.", points: 1090, rank: 14, location: "Malindi", avatar: "FA", stats: { quests: 38, plots: 1, streak: 7 } },
  { id: 8, name: "Robert K.", points: 980, rank: 15, location: "Bungoma", avatar: "RK", stats: { quests: 32, plots: 0, streak: 5 } },
  { id: 9, name: "Grace W.", points: 920, rank: 16, location: "Kitale", avatar: "GW", stats: { quests: 29, plots: 1, streak: 3 } },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get leaderboard data
    setTimeout(() => {
      // Add the current user to the mock data at an appropriate position
      const userData = user ? {
        id: 100,
        name: user.name || user.email?.split('@')[0] || "You",
        points: user.points || 1250,
        rank: 12,
        location: "Your Location",
        avatar: "TG",
        stats: { quests: 42, plots: 3, streak: 12 },
        isUser: true
      } : null;

      // Merge user data into mock data (just for demo)
      const data = [...mockLeaderboardData];
      if (userData) {
        data.splice(5, 0, userData); // Insert at position 5 for demo
      }
      
      setLeaderboardData(data);
      setLoading(false);
    }, 500);
  }, [user]);

  const timeFilters = [
    { id: 'all-time', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
    { id: 'daily', label: 'Today' },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Rankings</CardTitle>
          <CardDescription>Loading leaderboard...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
                <div className="flex items-center gap-3 w-8/12">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="w-2/12">
                  <div className="h-4 bg-muted rounded w-8 animate-pulse" />
                </div>
                <div className="w-2/12">
                  <div className="h-4 bg-muted rounded w-8 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Community Rankings</CardTitle>
            <CardDescription>Top land guardians in your community</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant={timeFilter === filter.id ? "default" : "outline"}
                className={`cursor-pointer ${timeFilter === filter.id ? 'bg-primary' : ''}`}
                onClick={() => setTimeFilter(filter.id)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((userEntry) => (
            <div 
              key={userEntry.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                userEntry.isUser ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 w-8/12">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  userEntry.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                  userEntry.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                  userEntry.rank === 3 ? 'bg-amber-100 text-amber-800' : 
                  'bg-muted'
                }`}>
                  {userEntry.rank <= 3 ? (
                    <Trophy className={`h-5 w-5 ${
                      userEntry.rank === 1 ? 'text-yellow-500' : 
                      userEntry.rank === 2 ? 'text-gray-400' : 
                      'text-amber-600'
                    }`} />
                  ) : (
                    <span className="font-semibold">{userEntry.rank}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-sm font-medium">{userEntry.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${userEntry.isUser ? 'text-primary font-bold' : ''}`}>
                      {userEntry.name}
                      {userEntry.isUser && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">You</span>}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {userEntry.location}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-2/12 text-center">
                <p className="font-semibold">{userEntry.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
              
              <div className="w-2/12 text-center">
                <p className="font-semibold">{userEntry.stats.quests}</p>
                <p className="text-xs text-muted-foreground">quests</p>
              </div>
              
              <div className="w-2/12 text-center">
                <p className="font-semibold">{userEntry.stats.streak}</p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;