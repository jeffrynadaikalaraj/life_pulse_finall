"use client"

import { useState, useEffect } from "react"
import { Bell, AlertCircle, X, CheckCircle, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: number
  type: "emergency" | "success" | "info" | "warning"
  title: string
  message: string
  time: string
  unread: boolean
  priority: "high" | "medium" | "low"
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>("all")
  const { toast } = useToast()

  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: "emergency",
      title: "Urgent Blood Request - O- Required",
      message:
        "Apollo Hospital Mumbai needs O- blood immediately for emergency surgery. Patient in critical condition.",
      time: "2 minutes ago",
      unread: true,
      priority: "high",
    },
    {
      id: 2,
      type: "success",
      title: "Blood Request Fulfilled Successfully",
      message: "Your B+ blood request has been successfully matched with 3 donors. Hospital has been notified.",
      time: "15 minutes ago",
      unread: true,
      priority: "medium",
    },
    {
      id: 3,
      type: "info",
      title: "New Donor Registrations",
      message: "5 new donors registered in your area in the last hour. Total active donors: 1,247",
      time: "1 hour ago",
      unread: false,
      priority: "low",
    },
    {
      id: 4,
      type: "warning",
      title: "Low Stock Alert - AB- Blood",
      message: "AB- blood stock running low in Chennai region. Only 2 units remaining.",
      time: "2 hours ago",
      unread: false,
      priority: "high",
    },
    {
      id: 5,
      type: "success",
      title: "Donor Match Found",
      message: "Perfect match found for A+ blood request at Max Hospital Delhi. Donor contacted successfully.",
      time: "3 hours ago",
      unread: false,
      priority: "medium",
    },
    {
      id: 6,
      type: "info",
      title: "System Maintenance Complete",
      message: "Scheduled maintenance completed successfully. All systems are now fully operational.",
      time: "5 hours ago",
      unread: false,
      priority: "low",
    },
  ]

  useEffect(() => {
    setNotifications(mockNotifications)
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return notification.unread
    return notification.type === filter
  })

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    })
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Smart Notifications</h1>
        <p className="text-xl text-muted-foreground">Real-time alerts and updates from the LifePulse network</p>
      </div>

      {/* Notification Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Emergency Alerts",
            count: notifications.filter((n) => n.type === "emergency").length,
            icon: AlertCircle,
            color: "red",
            filter: "emergency",
          },
          {
            label: "Success Updates",
            count: notifications.filter((n) => n.type === "success").length,
            icon: CheckCircle,
            color: "green",
            filter: "success",
          },
          {
            label: "Information",
            count: notifications.filter((n) => n.type === "info").length,
            icon: Info,
            color: "blue",
            filter: "info",
          },
          {
            label: "Warnings",
            count: notifications.filter((n) => n.type === "warning").length,
            icon: Clock,
            color: "yellow",
            filter: "warning",
          },
        ].map((category, index) => (
          <Card
            key={index}
            className={`glass-card text-center p-4 hover-lift cursor-pointer transition-all duration-300 ${
              filter === category.filter ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setFilter(filter === category.filter ? "all" : category.filter)}
          >
            <category.icon className={`w-8 h-8 mx-auto mb-2 text-${category.color}-500`} />
            <div className="text-2xl font-bold text-foreground">{category.count}</div>
            <div className="text-sm text-muted-foreground">{category.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: "All", value: "all" },
          { label: "Unread", value: "unread" },
          { label: "Emergency", value: "emergency" },
          { label: "Success", value: "success" },
          { label: "Info", value: "info" },
          { label: "Warning", value: "warning" },
        ].map((filterOption) => (
          <Button
            key={filterOption.value}
            variant={filter === filterOption.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.value)}
            className="transition-all duration-300"
          >
            {filterOption.label}
            {filterOption.value === "unread" && unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white animate-pulse">{unreadCount} unread</Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark All Read
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "You're all caught up! No notifications to show."
                    : `No ${filter} notifications found.`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${getNotificationBorderColor(
                    notification.type,
                  )} ${notification.unread ? "opacity-100" : "opacity-70"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="font-semibold text-foreground ml-2 flex-1">{notification.title}</h4>
                        {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                        {notification.priority === "high" && (
                          <Badge className="ml-2 bg-red-500 text-white text-xs">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                        <div className="flex items-center space-x-2">
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
