import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Search, 
  Mail, 
  Phone,
  Globe,
  MapPin,
  Calendar,
  Target,
  Bot,
  Sprout
} from "lucide-react";

const HelpFAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ data
  const faqs = [
    {
      id: 1,
      category: 'quests',
      question: 'How do I complete a quest?',
      answer: 'To complete a quest, navigate to the Quests page, select a nearby quest, tap "Start Quest", take a photo of the required land feature, and submit it for AI validation. You\'ll earn points and potentially unlock educational content!'
    },
    {
      id: 2,
      category: 'ai',
      question: 'How does the AI advisor work?',
      answer: 'Our AI advisor uses advanced language models to provide personalized land restoration advice. Simply type your question in the AI Advisor chat, and the system will provide context-aware recommendations based on your location, climate, and land conditions.'
    },
    {
      id: 3,
      category: 'plots',
      question: 'How do I claim a plot for restoration?',
      answer: 'Go to the Plots page, tap "Claim New Plot", use the drawing tools to outline the area on the map, add details about the land condition, and submit your plot claim. You can then track restoration progress over time.'
    },
    {
      id: 4,
      category: 'points',
      question: 'How are points calculated?',
      answer: 'Points are awarded based on quest difficulty and validation confidence. Easy quests give 50 points, medium 75 points, and hard 100 points. Perfect AI validation can provide bonus points.'
    },
    {
      id: 5,
      category: 'badges',
      question: 'What badges can I earn?',
      answer: 'You can earn badges like Land Guardian (10 quests), Eco Warrior (50 quests), Restoration Hero (100 quests), Streak Master (7-day streak), Diversity Champion (all quest types), and many more!'
    },
    {
      id: 6,
      category: 'offline',
      question: 'Does the app work offline?',
      answer: 'Yes! TerraGuardian has offline capabilities. You can complete quests, take photos, and your submissions will sync automatically when you reconnect to the internet.'
    },
    {
      id: 7,
      category: 'impact',
      question: 'How is my impact measured?',
      answer: 'Your impact is measured through hectares restored, CO₂ sequestered, biodiversity tracked, and community engagement. We use a combination of your submissions, AI analysis, and satellite verification to calculate your environmental impact.'
    },
    {
      id: 8,
      category: 'privacy',
      question: 'What happens to my data?',
      answer: 'Your data is encrypted and only used to improve the service and provide you with personalized recommendations. We follow strict privacy policies and never sell your data to third parties.'
    }
  ];

  // Filter FAQs based on search
  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faaq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  // Group FAQs by category
  const categories = {
    quests: { title: 'Quests', icon: Target, items: [] },
    ai: { title: 'AI Advisor', icon: Bot, items: [] },
    plots: { title: 'Plots', icon: MapPin, items: [] },
    points: { title: 'Points & Rewards', icon: Calendar, items: [] },
    badges: { title: 'Badges', icon: Target, items: [] },
    offline: { title: 'Offline', icon: Globe, items: [] },
    impact: { title: 'Impact', icon: Sprout, items: [] },
    privacy: { title: 'Privacy', icon: HelpCircle, items: [] }
  };

  // Categorize FAQs
  filteredFAQs.forEach(faq => {
    if (categories[faq.category as keyof typeof categories]) {
      categories[faq.category as keyof typeof categories].items.push(faq);
    }
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <HelpCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Chat with AI Advisor</h3>
            <p className="text-sm text-muted-foreground mb-3">Get instant answers about land restoration</p>
            <Button variant="outline" size="sm">Open Chat</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Report an Issue</h3>
            <p className="text-sm text-muted-foreground mb-3">Something not working as expected?</p>
            <Button variant="outline" size="sm">Report Issue</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Contact Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Email our support team</p>
            <Button variant="outline" size="sm">Contact Us</Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {Object.entries(categories).map(([key, category]) => {
          const CategoryIcon = category.icon;
          if (category.items.length === 0) return null;
          
          return (
            <section key={key} id={key}>
              <div className="flex items-center gap-3 mb-6">
                <CategoryIcon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.items.map((faq) => (
                  <AccordionItem value={`item-${faq.id}`} key={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          );
        })}
      </div>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Our support team is here to assist you with any questions or issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </h3>
                <p className="text-sm text-muted-foreground">support@terraguardian.org</p>
                <p className="text-xs text-muted-foreground mt-1">We typically respond within 24 hours</p>
              </div>
              
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  Emergency Support
                </h3>
                <p className="text-sm text-muted-foreground">Available for critical issues</p>
                <p className="text-xs text-muted-foreground mt-1">Priority response within 2 hours</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Send us a message</h3>
              <div className="space-y-4">
                <Input placeholder="Your email" />
                <Textarea placeholder="How can we help you?" rows={4} />
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>Learn how to engage respectfully with our community</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Read Guidelines</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Understand how we protect your data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Policy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpFAQ;