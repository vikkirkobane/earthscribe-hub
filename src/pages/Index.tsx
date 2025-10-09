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
      <Features />
      <HowItWorks />
      <QuestFeed />
      <ImpactDashboard />
      <Footer />
    </div>
  );
};

export default Index;
