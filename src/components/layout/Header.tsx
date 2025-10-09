import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sprout, User, LogOut, Trophy, Map, Bot, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-full">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">TerraGuardian</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link to="/quests" className="text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>Quests</span>
                  </div>
                </Link>
                <Link to="/ai-advisor" className="text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-1">
                    <Bot className="h-4 w-4" />
                    <span>AI Advisor</span>
                  </div>
                </Link>
                <Link to="/plots" className="text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>My Plots</span>
                  </div>
                </Link>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {user ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Target className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        to="/quests" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Quests</span>
                      </Link>
                      <Link 
                        to="/ai-advisor" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Bot className="h-4 w-4" />
                        <span>AI Advisor</span>
                      </Link>
                      <Link 
                        to="/plots" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Map className="h-4 w-4" />
                        <span>My Plots</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={handleSignOut}
                        disabled={loading}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;