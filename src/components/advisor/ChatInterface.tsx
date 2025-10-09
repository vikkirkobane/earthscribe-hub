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
  Wrench,
  RotateCcw,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sendMessageToClaude, getChatHistory, saveChatHistory, getUserContext, generateEducationalContent } from "@/services/claude";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  isEducational?: boolean;
}

interface ChatInterfaceProps {
  questType?: string; // Optional quest type to provide context-specific advice
}

const ChatInterface = ({ questType }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Load chat history when component mounts
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const history = await getChatHistory(user.id);
      // Convert chat history to our message format
      const formattedMessages = history.map((chat, index) => ({
        id: `hist-${index}`,
        text: chat.message,
        sender: 'user' as const,
        timestamp: chat.created_at
      })).concat(history.map((chat, index) => ({
        id: `resp-${index}`,
        text: chat.response,
        sender: 'ai' as const,
        timestamp: chat.created_at
      })));
      
      // Sort by timestamp and set to state
      formattedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.id || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get user context
      const context = await getUserContext(user.id);
      
      // Send to Claude API
      const response = await sendMessageToClaude(inputMessage, context);
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save to history
      await saveChatHistory(user.id, inputMessage, response, context);
      
      // If this was related to a quest, generate educational content
      if (questType) {
        const educationalContent = await generateEducationalContent(questType, context);
        if (educationalContent) {
          const educationalMessage: Message = {
            id: `edu-${Date.now()}`,
            text: educationalContent,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            isEducational: true
          };
          setMessages(prev => [...prev, educationalMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string, category?: string) => {
    setInputMessage(action);
    setActiveCategory(category || null);
    setTimeout(() => {
      const sendButton = document.querySelector('button[title="Send"]');
      if (sendButton) (sendButton as HTMLButtonElement).click();
    }, 100);
  };

  const quickActions = [
    { id: 1, title: "Improve soil health", icon: Sprout, action: "How can I improve soil health in my area?", category: "soil_health" },
    { id: 2, title: "Native species", icon: Leaf, action: "What native plants should I grow?", category: "native_species" },
    { id: 3, title: "Erosion control", icon: Mountain, action: "How do I control soil erosion?", category: "erosion_control" },
    { id: 4, title: "Water management", icon: Droplets, action: "Best practices for water management?", category: "water_management" },
    { id: 5, title: "Seasonal plan", icon: Calendar, action: "What should I do this season?", category: "seasonal_planning" },
    { id: 6, title: "Pest control", icon: Wrench, action: "Natural pest control methods?", category: "pest_control" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Badges - Only show if questType is provided or if a category is active */}
      {(questType || activeCategory) && (
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={activeCategory === 'soil_health' ? "default" : "outline"}
            className={activeCategory === 'soil_health' ? 'bg-green-600' : ''}
          >
            Soil Health
          </Badge>
          <Badge 
            variant={activeCategory === 'native_species' ? "default" : "outline"}
            className={activeCategory === 'native_species' ? 'bg-green-600' : ''}
          >
            Native Species
          </Badge>
          <Badge 
            variant={activeCategory === 'erosion_control' ? "default" : "outline"}
            className={activeCategory === 'erosion_control' ? 'bg-green-600' : ''}
          >
            Erosion Control
          </Badge>
          {questType && (
            <Badge variant="secondary">
              {questType.replace('_', ' ')}
            </Badge>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuickAction(action.action, action.category)}
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
      <Card className="flex flex-col h-[500px]">
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
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                  <p>Ask me about land restoration, farming techniques, or environmental practices</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : message.isEducational 
                          ? 'bg-blue-50 border border-blue-200 rounded-bl-none text-blue-800'
                          : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 
                      message.isEducational ? 'text-blue-600' : 'text-muted-foreground'
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
                disabled={isLoading}
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
    </div>
  );
};

export default ChatInterface;