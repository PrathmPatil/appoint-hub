import { useState, useEffect, useRef, useCallback } from "react";

export interface RealTimeEvent {
  type:
    | "booking_update"
    | "availability_change"
    | "new_message"
    | "provider_status"
    | "notification";
  data: any;
  timestamp: string;
  userId?: string;
}

export interface RealTimeConnection {
  isConnected: boolean;
  lastEvent: RealTimeEvent | null;
  sendMessage: (message: any) => void;
  subscribe: (eventType: string, callback: (data: any) => void) => void;
  unsubscribe: (eventType: string) => void;
}

export const useRealTimeData = (userId?: string): RealTimeConnection => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealTimeEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Map<string, ((data: any) => void)[]>>(
    new Map(),
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const mockIntervalRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Check if WebSocket server is available in development
    const isDevelopment = process.env.NODE_ENV !== "production";

    if (isDevelopment) {
      // In development, use mock data instead of trying to connect to a real WebSocket
      console.log("Development mode: Using mock real-time data instead of WebSocket");
      setIsConnected(true); // Simulate connection for development

      // Start mock data simulation
      startMockDataSimulation();
      return;
    }

    try {
      // In production, this would be your WebSocket server URL
      const wsUrl = "wss://your-websocket-server.com/ws";

      wsRef.current = new WebSocket(`${wsUrl}?userId=${userId || "anonymous"}`);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Send initial connection message
        if (wsRef.current && userId) {
          wsRef.current.send(
            JSON.stringify({
              type: "user_connected",
              userId,
              timestamp: new Date().toISOString(),
            }),
          );
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const eventData: RealTimeEvent = JSON.parse(event.data);
          setLastEvent(eventData);

          // Notify subscribers
          const subscribers = subscribersRef.current.get(eventData.type) || [];
          subscribers.forEach((callback) => callback(eventData.data));

          // Handle global events
          handleGlobalEvent(eventData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect if not intentionally closed
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, timeout);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket connection failed:", error);
        // Fall back to mock data in case of connection failure
        console.log("Falling back to mock real-time data");
        setIsConnected(true);
        startMockDataSimulation();
      };
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      // Fall back to mock data
      console.log("Using mock real-time data due to connection error");
      setIsConnected(true);
      startMockDataSimulation();
    }
  }, [userId]);

  const startMockDataSimulation = useCallback(() => {
    // Generate mock real-time events every 30 seconds
    mockIntervalRef.current = setInterval(() => {
      const mockEvents = getMockEvents();
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

      const eventData: RealTimeEvent = {
        ...randomEvent,
        timestamp: new Date().toISOString(),
        userId: userId,
      };

      setLastEvent(eventData);

      // Notify subscribers
      const subscribers = subscribersRef.current.get(eventData.type) || [];
      subscribers.forEach((callback) => callback(eventData.data));

      // Handle global events
      handleGlobalEvent(eventData);
    }, 30000); // Every 30 seconds
  }, [userId]);

  const getMockEvents = () => [
    {
      type: "availability_change" as const,
      data: {
        providerId: "doc-123",
        availableSlots: ["10:00", "11:00", "14:00", "15:00"],
        date: new Date().toISOString().split('T')[0],
      },
    },
    {
      type: "booking_update" as const,
      data: {
        bookingId: `book-${Date.now()}`,
        status: "confirmed",
        time: "10:00 AM",
        serviceName: "General Consultation"
      },
    },
    {
      type: "provider_status" as const,
      data: {
        providerId: "doc-123",
        status: "online",
        lastSeen: new Date().toISOString(),
      },
    },
    {
      type: "notification" as const,
      data: {
        id: `notif-${Date.now()}`,
        title: "New booking request",
        message: "You have a new appointment request",
        type: "info"
      },
    },
  ];

  const handleGlobalEvent = (event: RealTimeEvent) => {
    switch (event.type) {
      case "booking_update":
        // Handle booking updates
        console.log("Booking updated:", event.data);
        break;
      case "availability_change":
        // Handle availability changes
        console.log("Availability changed:", event.data);
        break;
      case "new_message":
        // Handle new chat messages
        console.log("New message:", event.data);
        break;
      case "provider_status":
        // Handle provider status changes
        console.log("Provider status changed:", event.data);
        break;
      case "notification":
        // Handle notifications
        console.log("New notification:", event.data);
        break;
    }
  };

  const sendMessage = useCallback(
    (message: any) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            ...message,
            timestamp: new Date().toISOString(),
            userId,
          }),
        );
      } else if (process.env.NODE_ENV !== "production") {
        // In development mode, just log the message
        console.log("Mock WebSocket send:", {
          ...message,
          timestamp: new Date().toISOString(),
          userId,
        });
      } else {
        console.warn("WebSocket is not connected");
      }
    },
    [userId],
  );

  const subscribe = useCallback(
    (eventType: string, callback: (data: any) => void) => {
      const currentSubscribers = subscribersRef.current.get(eventType) || [];
      subscribersRef.current.set(eventType, [...currentSubscribers, callback]);
    },
    [],
  );

  const unsubscribe = useCallback((eventType: string) => {
    subscribersRef.current.delete(eventType);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastEvent,
    sendMessage,
    subscribe,
    unsubscribe,
  };
};

// Mock WebSocket server simulation for development
export const mockWebSocketServer = () => {
  // This simulates real-time events for development
  const events = [
    {
      type: "availability_change",
      data: {
        providerId: "doc-123",
        availableSlots: ["10:00", "11:00", "14:00"],
      },
    },
    {
      type: "booking_update",
      data: { bookingId: "book-456", status: "confirmed", time: "10:00 AM" },
    },
    {
      type: "provider_status",
      data: {
        providerId: "doc-123",
        status: "online",
        lastSeen: new Date().toISOString(),
      },
    },
  ];

  return events;
};
