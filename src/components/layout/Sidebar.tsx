import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Bot, 
  Map, 
  Target, 
  User, 
  LogOut, 
  Sprout,
  Award,
  Leaf,
  Calendar,
  BadgeCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return null; // Don't show sidebar when not logged in
  }

  const navItems = [
    {
      title: "Dashboard",
      icon: Target,
      href: "/dashboard"
    },
    {
      title: "Quests",
      icon: Trophy,
      href: "/quests"
    },
    {
      title: "AI Advisor",
      icon: Bot,
      href: "/ai-advisor"
    },
    {
      title: "My Plots",
      icon: Map,
      href: "/plots"
    },
    {
      title: "Impact",
      icon: Leaf,
      href: "/impact"
    },
    {
      title: "Leaderboard",
      icon: Award,
      href: "/leaderboard"
    },
    {
      title: "My Profile",
      icon: User,
      href: "/profile"
    }
  ];

  return (
    <div className="w-64 h-full bg-background border-r flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="bg-primary p-2 rounded-full">
          <Sprout className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold">TerraGuardian</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${isActive ? 'bg-accent' : ''}`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {user.name || user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.points || 0} points
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;