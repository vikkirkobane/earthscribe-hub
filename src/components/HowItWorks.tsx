import { Card, CardContent } from "@/components/ui/card";
import { Camera, Bot, MapPin, BarChart3 } from "lucide-react";
import iconSeedling from "@/assets/icon-seedling.png";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Complete Quests",
    description: "Select a quest near you, capture photos of land conditions, and submit for AI validation. Earn points and badges for every contribution."
  },
  {
    number: "02",
    icon: Bot,
    title: "Get AI Guidance",
    description: "Ask our AI advisor anything about land restoration. Get personalized advice based on your location, climate, and soil conditions."
  },
  {
    number: "03",
    icon: MapPin,
    title: "Claim & Restore Plots",
    description: "Identify degraded land, claim a restoration plot, and document your regeneration journey with photos and progress updates."
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track Your Impact",
    description: "Watch your impact grow with satellite-verified metrics. See vegetation recovery, CO₂ sequestration, and biodiversity improvements."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
        <img src={iconSeedling} alt="" className="w-full h-full animate-float" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient">TerraGuardian</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to become a land guardian and create lasting environmental impact
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group relative overflow-hidden"
            >
              {/* Step Number Background */}
              <div className="absolute top-0 right-0 text-9xl font-bold text-muted/10 leading-none pointer-events-none">
                {step.number}
              </div>

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-4 rounded-2xl gradient-hero text-white group-hover:scale-110 transition-transform shrink-0">
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-bold text-primary">STEP {step.number}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
