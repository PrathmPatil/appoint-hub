import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  Calendar,
  MapPin,
  Star,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot" | "agent";
  timestamp: Date;
  type?: "text" | "quick_reply" | "card" | "link";
  metadata?: any;
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
}

interface ChatBotProps {
  userId?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, sendMessage, subscribe } = useRealTimeData(userId);

  // Message ID counter to ensure unique IDs
  const messageIdCounter = useRef(0);

  // Generate unique message ID
  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `msg_${Date.now()}_${messageIdCounter.current}`;
  };

  // Predefined responses and intents
  const intents = {
    greeting: {
      patterns: ["hello", "hi", "hey", "good morning", "good afternoon"],
      responses: [
        "Hello! I'm here to help you with appointments and services. How can I assist you today?",
        "Hi there! Welcome to AppointHub. What can I help you find today?",
      ],
    },
    booking: {
      patterns: ["book", "appointment", "schedule", "reserve"],
      responses: [
        "I'd be happy to help you book an appointment! What type of service are you looking for?",
        "Great! Let's find you an appointment. Which category interests you - Healthcare, Beauty, Legal, or something else?",
      ],
    },
    search: {
      patterns: ["find", "search", "looking for", "need"],
      responses: [
        "I can help you find the perfect service provider. What type of service do you need?",
        "Let me help you search for providers. What service are you looking for?",
      ],
    },
    support: {
      patterns: ["help", "support", "problem", "issue", "contact"],
      responses: [
        "I'm here to help! You can also contact our support team at support@appointhub.com or call +1-800-APPOINT",
        "For immediate assistance, I can connect you with a human agent. Would you like me to do that?",
      ],
    },
    pricing: {
      patterns: ["price", "cost", "fee", "payment", "charge"],
      responses: [
        "Pricing varies by service provider. Most consultations start from ₹500. Would you like me to show you specific pricing for a service?",
        "Our platform is free to use! You only pay the service provider directly. Want to see pricing for specific services?",
      ],
    },
  };

  const quickReplyOptions = [
    { id: "book", text: "📅 Book Appointment", action: "book_appointment" },
    { id: "search", text: "🔍 Find Services", action: "search_services" },
    { id: "support", text: "💬 Human Support", action: "human_support" },
    { id: "pricing", text: "💰 View Pricing", action: "view_pricing" },
    { id: "help", text: "❓ How it Works", action: "how_it_works" },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Welcome to AppointHub! I'm your personal booking assistant. I can help you find and book appointments with verified professionals.",
        "text",
      );
      setQuickReplies(quickReplyOptions);
    }
  }, [isOpen]);

  useEffect(() => {
    // Subscribe to real-time chat messages
    subscribe("new_message", handleNewMessage);
    subscribe("agent_joined", handleAgentJoined);
  }, [subscribe]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (data: any) => {
    if (data.sender === "agent") {
      const newMessage: ChatMessage = {
        id: generateUniqueId(),
        content: data.content,
        sender: "agent",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsAgentMode(true);
    }
  };

  const handleAgentJoined = (data: any) => {
    addBotMessage(
      `🎧 ${data.agentName} from our support team has joined the chat and will assist you now.`,
    );
    setIsAgentMode(true);
  };

  const addBotMessage = (
    content: string,
    type: "text" | "card" | "link" = "text",
    metadata?: any,
  ) => {
    const message: ChatMessage = {
      id: generateUniqueId(),
      content,
      sender: "bot",
      timestamp: new Date(),
      type,
      metadata,
    };
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: generateUniqueId(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, message]);
  };

  const processMessage = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple intent matching
    let response =
      "I understand you're looking for help. Let me connect you with specific information.";
    let detectedIntent = null;

    for (const [intent, config] of Object.entries(intents)) {
      if (config.patterns.some((pattern) => lowerMessage.includes(pattern))) {
        detectedIntent = intent;
        response =
          config.responses[Math.floor(Math.random() * config.responses.length)];
        break;
      }
    }

    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(
      () => {
        setIsTyping(false);
        addBotMessage(response);

        // Add contextual quick replies based on intent
        if (detectedIntent === "booking") {
          setQuickReplies([
            {
              id: "healthcare",
              text: "🏥 Healthcare",
              action: "search_healthcare",
            },
            { id: "beauty", text: "💄 Beauty & Spa", action: "search_beauty" },
            { id: "legal", text: "⚖️ Legal Services", action: "search_legal" },
            { id: "auto", text: "🚗 Automotive", action: "search_auto" },
          ]);
        } else if (detectedIntent === "support") {
          setQuickReplies([
            { id: "agent", text: "👨‍💼 Talk to Agent", action: "connect_agent" },
            { id: "faq", text: "❓ View FAQ", action: "view_faq" },
            { id: "email", text: "📧 Email Support", action: "email_support" },
          ]);
        }
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    const message = inputMessage;
    setInputMessage("");
    setQuickReplies([]);

    if (isAgentMode && isConnected) {
      // Send to agent via WebSocket
      sendMessage({
        type: "chat_message",
        content: message,
        sender: "user",
        chatId: `chat_${userId}_${Date.now()}`,
      });
    } else {
      // Process with bot
      await processMessage(message);
    }
  };

  const handleQuickReply = (quickReply: QuickReply) => {
    addUserMessage(quickReply.text);
    setQuickReplies([]);

    switch (quickReply.action) {
      case "book_appointment":
        addBotMessage(
          "Perfect! Let me help you book an appointment. What type of service do you need?",
          "card",
          {
            type: "service_categories",
            categories: [
              "Healthcare",
              "Beauty & Personal Care",
              "Legal & Financial",
              "Education & Coaching",
            ],
          },
        );
        break;
      case "search_services":
        addBotMessage(
          "Great! I can help you search for services. You can search by:",
          "text",
        );
        setQuickReplies([
          { id: "location", text: "📍 Near Me", action: "search_location" },
          { id: "category", text: "📋 By Category", action: "search_category" },
          { id: "name", text: "🔍 By Name", action: "search_name" },
        ]);
        break;
      case "human_support":
        addBotMessage(
          "I'm connecting you with a human agent. Please wait a moment...",
          "text",
        );
        if (isConnected) {
          sendMessage({
            type: "request_agent",
            userId,
            reason: "user_requested",
          });
        }
        break;
      case "view_pricing":
        addBotMessage("Here's our pricing structure:", "card", {
          type: "pricing_info",
          items: [
            { service: "Doctor Consultation", price: "₹500-2000" },
            { service: "Lawyer Consultation", price: "₹1000-5000" },
            { service: "Hair Salon", price: "₹300-1500" },
            { service: "Car Service", price: "₹800-3000" },
          ],
        });
        break;
      case "how_it_works":
        addBotMessage("Here's how AppointHub works:", "card", {
          type: "how_it_works",
          steps: [
            "1. Search for services near you",
            "2. Choose a verified professional",
            "3. Book your preferred time slot",
            "4. Get confirmation & reminders",
            "5. Attend appointment & review",
          ],
        });
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === "bot";
    const isAgent = message.sender === "agent";

    return (
      <div
        key={message.id}
        className={`flex ${isBot || isAgent ? "justify-start" : "justify-end"} mb-4`}
      >
        <div
          className={`flex max-w-[80%] ${isBot || isAgent ? "flex-row" : "flex-row-reverse"}`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isBot
                ? "bg-blue-100 text-blue-600"
                : isAgent
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
            } ${isBot || isAgent ? "mr-2" : "ml-2"}`}
          >
            {isBot ? (
              <Bot className="h-4 w-4" />
            ) : isAgent ? (
              <Phone className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div
            className={`px-4 py-2 rounded-lg ${
              isBot || isAgent
                ? "bg-gray-100 text-gray-800"
                : "bg-blue-600 text-white"
            }`}
          >
            {message.type === "card" && message.metadata ? (
              <div className="space-y-2">
                <p>{message.content}</p>
                {renderMessageCard(message.metadata)}
              </div>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
            <p className={`text-xs mt-1 opacity-70`}>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {isAgent && <span className="ml-1">(Agent)</span>}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageCard = (metadata: any) => {
    switch (metadata.type) {
      case "pricing_info":
        return (
          <div className="bg-white p-3 rounded border">
            {metadata.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1">
                <span className="text-sm">{item.service}</span>
                <span className="text-sm font-medium text-green-600">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        );
      case "how_it_works":
        return (
          <div className="bg-white p-3 rounded border">
            {metadata.steps.map((step: string, index: number) => (
              <div key={index} className="flex items-center py-1">
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">AppointHub Assistant</CardTitle>
            {isConnected && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-600"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-500 h-8 w-8 p-0"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-500 h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                {messages.map(renderMessage)}

                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        AI Assistant is typing...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </ScrollArea>

              {quickReplies.length > 0 && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <Button
                        key={reply.id}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Powered by AI ��� Human support available</span>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <span>+1-800-APPOINT</span>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
