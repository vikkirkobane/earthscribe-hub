import { Button } from "@/components/ui/button";
import { Sprout, Target, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-restoration.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Community members working together in land restoration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sprout className="w-4 h-4" />
            <span className="text-sm font-medium">Where Community Meets AI for Climate Action</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            TerraGuardian
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            Transform Your Community Into Land Stewards
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Gamified land monitoring meets AI-powered regeneration guidance. 
            Document restoration, earn rewards, and create measurable climate impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="text-lg px-8">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-white/70">Active Guardians</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-white/70">Hectares Restored</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-sky" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">2M+</div>
              <div className="text-sm text-white/70">Quests Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Sprout className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">50K</div>
              <div className="text-sm text-white/70">Tons CO₂ Offset</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
