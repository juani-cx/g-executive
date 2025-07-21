import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  onMessage?: (message: string) => void;
  suggestions?: string[];
  className?: string;
}

export default function AIAssistant({ onMessage, suggestions = [], className }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "I'm analyzing your image and generating campaign assets based on your brand tone. Would you like me to adjust anything specific?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessage?.(inputValue);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you refine that. Let me update the assets based on your feedback.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Card className={`border border-outline-variant ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="text-white w-4 h-4" />
          </div>
          <span className="font-medium text-on-surface">AI Assistant</span>
        </div>

        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-xl ${
                message.isUser
                  ? 'bg-primary text-white ml-8'
                  : 'bg-surface text-on-surface mr-8'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-on-surface-variant mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            placeholder="Ask me to modify anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white border-outline-variant"
          />
          <Button onClick={sendMessage} className="bg-primary text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
