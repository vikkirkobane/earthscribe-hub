import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Leaf, 
  Droplets, 
  Mountain, 
  Sprout, 
  Calendar,
  Wrench
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AIAdvisor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your TerraGuardian AI Advisor. How can I help you with land restoration today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: "Thank you for your question! Based on your location and the current season, I recommend focusing on soil health improvement. Consider adding organic matter like compost and implementing cover crops to prevent erosion.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => {
      const sendButton = document.querySelector('button[title="Send"]');
      if (sendButton) (sendButton as HTMLButtonElement).click();
    }, 100);
  };

  const quickActions = [
    { id: 1, title: "Improve soil health", icon: Sprout, action: "How can I improve soil health in my area?" },
    { id: 2, title: "Native species", icon: Leaf, action: "What native plants should I grow?" },
    { id: 3, title: "Erosion control", icon: Mountain, action: "How do I control soil erosion?" },
    { id: 4, title: "Water management", icon: Droplets, action: "Best practices for water management?" },
    { id: 5, title: "Seasonal plan", icon: Calendar, action: "What should I do this season?" },
    { id: 6, title: "Pest control", icon: Wrench, action: "Natural pest control methods?" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Advisor</h1>
        <p className="text-muted-foreground">Get personalized land restoration advice from our AI expert</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuickAction(action.action)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{action.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>AI Advisor</CardTitle>
            <Badge variant="secondary" className="bg-accent/20 ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-lg rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask about land restoration, farming, or environmental practices..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                title="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                Soil Health Guide
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Learn about organic matter, pH levels, and beneficial microorganisms
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Read More
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <Mountain className="h-4 w-4 text-amber-500" />
                Erosion Control Tips
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Techniques for preventing soil erosion and managing water runoff
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Read More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAdvisor;