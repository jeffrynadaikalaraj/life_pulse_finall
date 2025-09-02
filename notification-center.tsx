"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Heart,
  Building2,
  Calendar,
  Info,
  X,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationData {
  id: string
  type: "emergency" | "success" | "warning" | "info" | "request"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "high" | "medium" | "low"
  details: {
    patientName?: string
    bloodType?: string
    hospital?: string
    hospitalAddress?: string
    hospitalPhone?: string
    location?: string
    unitsNeeded?: number
    urgency?: string
    requestId?: string
    donorCount?: number
    timeFrame?: string
    contactPerson?: string
    contactPhone?: string
    mapLink?: string
    description?: string
    status?: string
    region?: string
    stockLevel?: number
    requiredUnits?: number
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotifications = () => {
      const sampleNotifications: NotificationData[] = [
        {
          id: "notif-001",
          type: "emergency",
          title: "🚨 Critical Blood Request",
          message: "Emergency O- blood needed at Apollo Hospital Mumbai",
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          read: false,
          priority: "high",
          details: {
            patientName: "Rajesh Kumar",
            bloodType: "O-",
            hospital: "Apollo Hospital Mumbai",
            hospitalAddress: "Sahar Road, Andheri East, Mumbai - 400099",
            hospitalPhone: "+91 22 6767 4444",
            location: "Mumbai, Maharashtra",
            unitsNeeded: 3,
            urgency: "Critical",
            requestId: "REQ-2024-001",
            timeFrame: "Within 2 hours",
            contactPerson: "Dr. Priya Sharma",
            contactPhone: "+91 98765 43210",
            mapLink: "https://maps.google.com/?q=Apollo+Hospital+Mumbai",
            description:
              "Patient requires immediate blood transfusion due to severe accident injuries. Surgery scheduled within 2 hours.",
            status: "Urgent - Seeking Donors",
          },
        },
        {
          id: "notif-002",
          type: "success",
          title: "✅ Blood Request Fulfilled",
          message: "A+ blood request successfully matched with 2 donors",
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          read: false,
          priority: "medium",
          details: {
            patientName: "Priya Patel",
            bloodType: "A+",
            hospital: "Fortis Hospital Bangalore",
            hospitalAddress: "154/9, Bannerghatta Road, Bangalore - 560076",
            hospitalPhone: "+91 80 6621 4444",
            location: "Bangalore, Karnataka",
            unitsNeeded: 2,
            urgency: "High",
            requestId: "REQ-2024-002",
            donorCount: 2,
            timeFrame: "Completed",
            contactPerson: "Dr. Amit Reddy",
            contactPhone: "+91 98765 43211",
            mapLink: "https://maps.google.com/?q=Fortis+Hospital+Bangalore",
            description:
              "Blood transfusion for cancer treatment successfully arranged. Donors contacted and confirmed.",
            status: "Fulfilled - Donors Confirmed",
          },
        },
        {
          id: "notif-003",
          type: "warning",
          title: "⚠️ Low Blood Stock Alert",
          message: "AB- blood stock critically low in Delhi region",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: true,
          priority: "medium",
          details: {
            bloodType: "AB-",
            region: "Delhi NCR",
            stockLevel: 12,
            requiredUnits: 50,
            urgency: "Medium",
            description: "Current stock of AB- blood is below minimum threshold. Urgent donor drive needed.",
            status: "Stock Alert - Need Donors",
          },
        },
        {
          id: "notif-004",
          type: "info",
          title: "📊 Weekly Impact Report",
          message: "This week: 47 donations, 23 lives saved",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: true,
          priority: "low",
          details: {
            donorCount: 47,
            description: "Weekly summary of blood donation activities and impact in your region.",
            status: "Information Update",
          },
        },
        {
          id: "notif-005",
          type: "request",
          title: "🩸 Thalassemia Patient Support",
          message: "Regular transfusion needed for pediatric patient",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          read: false,
          priority: "high",
          details: {
            patientName: "Arya Sharma (Age: 12)",
            bloodType: "B+",
            hospital: "Tata Memorial Hospital Mumbai",
            hospitalAddress: "Dr. E Borges Road, Parel, Mumbai - 400012",
            hospitalPhone: "+91 22 2417 7000",
            location: "Mumbai, Maharashtra",
            unitsNeeded: 2,
            urgency: "High",
            requestId: "THAL-2024-001",
            timeFrame: "Next 3 days",
            contactPerson: "Dr. Rekha Sharma (Guardian)",
            contactPhone: "+91 98765 44001",
            mapLink: "https://maps.google.com/?q=Tata+Memorial+Hospital+Mumbai",
            description:
              "12-year-old thalassemia patient requires regular blood transfusion. Next transfusion due in 3 days.",
            status: "Scheduled - Seeking Regular Donors",
          },
        },
      ]

      setNotifications(sampleNotifications)
      setUnreadCount(sampleNotifications.filter((n) => !n.read).length)
    }

    generateNotifications()

    // Simulate new notifications every 30 seconds
    const interval = setInterval(() => {
      const newNotification: NotificationData = {
        id: `notif-${Date.now()}`,
        type: Math.random() > 0.5 ? "emergency" : "success",
        title: Math.random() > 0.5 ? "🚨 New Emergency Request" : "✅ Donor Match Found",
        message: Math.random() > 0.5 ? "B+ blood needed urgently" : "O+ donor matched successfully",
        timestamp: new Date(),
        read: false,
        priority: "high",
        details: {
          patientName: "Emergency Patient",
          bloodType: "B+",
          hospital: "City Hospital",
          hospitalAddress: "Main Street, City Center",
          hospitalPhone: "+91 98765 00000",
          location: "Current City",
          unitsNeeded: 1,
          urgency: "High",
          requestId: `REQ-${Date.now()}`,
          timeFrame: "Within 1 hour",
          contactPerson: "Emergency Contact",
          contactPhone: "+91 98765 00001",
          description: "New emergency blood request received.",
          status: "Active",
        },
      }

      setNotifications((prev) => [newNotification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show toast for new notifications
      toast({
        title: newNotification.title,
        description: newNotification.message,
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [toast])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
    setUnreadCount((prev) => {
      const deletedNotif = notifications.find((n) => n.id === notificationId)
      return deletedNotif && !deletedNotif.read ? prev - 1 : prev
    })
  }

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "request":
        return <Heart className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const callNumber = (number: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`
    }
  }

  const openMap = (mapLink: string) => {
    if (typeof window !== "undefined") {
      window.open(mapLink, "_blank")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="relative bg-transparent">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.2rem] h-5 text-xs bg-red-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications ({notifications.length})
              </DialogTitle>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-foreground truncate">{notification.title}</h4>
                            <Badge
                              className={`${getPriorityColor(notification.priority)} text-white text-xs px-1.5 py-0.5`}
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>

                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="flex-shrink-0 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Notification Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {getNotificationIcon(selectedNotification.type)}
                  <span className="ml-2">{selectedNotification.title}</span>
                  <Badge className={`ml-2 ${getPriorityColor(selectedNotification.priority)} text-white`}>
                    {selectedNotification.priority}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Request Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedNotification.details.patientName && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Patient</p>
                          <p className="font-medium">{selectedNotification.details.patientName}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.details.bloodType && (
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Type</p>
                          <p className="font-medium text-red-600">{selectedNotification.details.bloodType}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.details.unitsNeeded && (
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Units Needed</p>
                          <p className="font-medium">{selectedNotification.details.unitsNeeded} units</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.details.urgency && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Urgency</p>
                          <p className="font-medium">{selectedNotification.details.urgency}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.details.timeFrame && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time Frame</p>
                          <p className="font-medium">{selectedNotification.details.timeFrame}</p>
                        </div>
                      </div>
                    )}

                    {selectedNotification.details.requestId && (
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Request ID</p>
                          <p className="font-medium font-mono">{selectedNotification.details.requestId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hospital Information */}
                {selectedNotification.details.hospital && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hospital Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Building2 className="w-4 h-4 text-blue-500 mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Hospital</p>
                          <p className="font-medium">{selectedNotification.details.hospital}</p>
                        </div>
                      </div>

                      {selectedNotification.details.hospitalAddress && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-green-500 mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">{selectedNotification.details.hospitalAddress}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {selectedNotification.details.hospitalPhone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => callNumber(selectedNotification.details.hospitalPhone!)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Hospital
                          </Button>
                        )}

                        {selectedNotification.details.mapLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openMap(selectedNotification.details.mapLink!)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Map
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {selectedNotification.details.contactPerson && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact Person</p>
                          <p className="font-medium">{selectedNotification.details.contactPerson}</p>
                        </div>
                      </div>

                      {selectedNotification.details.contactPhone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => callNumber(selectedNotification.details.contactPhone!)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Contact
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedNotification.details.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{selectedNotification.details.description}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Status */}
                {selectedNotification.details.status && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Current Status</h3>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {selectedNotification.details.status}
                    </Badge>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  {selectedNotification.type === "emergency" && (
                    <>
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Respond to Emergency
                      </Button>
                      <Button variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Find Compatible Donors
                      </Button>
                    </>
                  )}

                  {selectedNotification.type === "request" && (
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Donation
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => setSelectedNotification(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
