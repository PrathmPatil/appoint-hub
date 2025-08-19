import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  X,
  Calendar,
  CreditCard,
  MessageCircle,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Building,
} from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useAuth } from "@/hooks/useAuthRedux";

export interface Notification {
  id: string;
  type: "booking" | "payment" | "message" | "review" | "system" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  metadata?: any;
}

interface NotificationSystemProps {
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  className,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { subscribe, isConnected } = useRealTimeData(user?.id);

  useEffect(() => {
    // Subscribe to real-time notifications
    subscribe("notification", handleNewNotification);
    subscribe("booking_update", handleBookingUpdate);
    subscribe("payment_update", handlePaymentUpdate);
    subscribe("new_message", handleNewMessage);
    subscribe("review_received", handleReviewReceived);

    // Load initial notifications
    loadInitialNotifications();
  }, [subscribe, user]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadInitialNotifications = () => {
    // Simulate loading notifications from API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "booking",
        title: "Appointment Confirmed",
        message:
          "Your appointment with Dr. Smith has been confirmed for tomorrow at 10:00 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        priority: "high",
        actionUrl: "/dashboard/bookings",
        metadata: { providerId: "dr-smith-123", appointmentId: "apt-456" },
      },
      {
        id: "2",
        type: "payment",
        title: "Payment Successful",
        message:
          "Payment of ₹1,200 for Hair Salon service has been processed successfully",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        priority: "medium",
        actionUrl: "/dashboard/payments",
        metadata: { amount: 1200, service: "Hair Salon" },
      },
      {
        id: "3",
        type: "reminder",
        title: "Appointment Reminder",
        message:
          "Don't forget your appointment tomorrow at 10:00 AM with Dr. Smith",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
        read: false,
        priority: "medium",
        actionUrl: "/dashboard/bookings",
      },
      {
        id: "4",
        type: "review",
        title: "Review Request",
        message:
          "How was your experience with CleanPro Services? Share your feedback",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
        priority: "low",
        actionUrl: "/dashboard/reviews",
      },
    ];

    setNotifications(mockNotifications);
  };

  const handleNewNotification = (data: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: data.type || "system",
      title: data.title,
      message: data.message,
      timestamp: new Date(),
      read: false,
      priority: data.priority || "medium",
      actionUrl: data.actionUrl,
      metadata: data.metadata,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
      });
    }
  };

  const handleBookingUpdate = (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: "booking",
      title: "Booking Update",
      message: `Your appointment status has been updated to: ${data.status}`,
      timestamp: new Date(),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/bookings",
      metadata: data,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  const handlePaymentUpdate = (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: "payment",
      title:
        data.status === "success" ? "Payment Successful" : "Payment Failed",
      message: `Payment of ₹${data.amount} has been ${data.status}`,
      timestamp: new Date(),
      read: false,
      priority: data.status === "success" ? "medium" : "high",
      actionUrl: "/dashboard/payments",
      metadata: data,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  const handleNewMessage = (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: "message",
      title: "New Message",
      message: `New message from ${data.senderName}`,
      timestamp: new Date(),
      read: false,
      priority: "medium",
      actionUrl: "/dashboard/messages",
      metadata: data,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  const handleReviewReceived = (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: "review",
      title: "New Review",
      message: `You received a ${data.rating}-star review from ${data.customerName}`,
      timestamp: new Date(),
      read: false,
      priority: "low",
      actionUrl: "/dashboard/reviews",
      metadata: data,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-blue-600 bg-blue-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-600 text-white text-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Connection Status */}
      {isConnected && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-96 max-h-[500px] shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : ""
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                            >
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.metadata && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {notification.priority}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {notifications.length > 0 && (
              <div className="p-3 border-t flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                >
                  Clear all notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
