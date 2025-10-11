import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import QuestFeed from "@/components/QuestFeed";
import ImpactDashboard from "@/components/ImpactDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="about">
        <HowItWorks />
      </div>
      <div id="community">
        <QuestFeed />
      </div>
      <div id="contact">
        <ImpactDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
