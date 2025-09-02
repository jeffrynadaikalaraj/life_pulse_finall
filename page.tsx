"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Heart,
  Users,
  MapPin,
  Activity,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  Navigation,
  AlertCircle,
  Search,
  UserPlus,
  Droplets,
  BarChart3,
  Shield,
  Stethoscope,
  Wifi,
  WifiOff,
  MessageCircle,
  Send,
  Bot,
  User,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "@/hooks/use-location"
import { useOffline } from "@/hooks/use-offline"
import { LiveStats } from "@/components/interactive/live-stats"
import { RealTimeMap } from "@/components/interactive/real-time-map"
import { AnimatedCounter } from "@/components/interactive/animated-counter"
import { chatbot } from "@/lib/chatbot"

// Import page components
import { FindBloodPage } from "@/components/pages/find-blood"
import { AllDonorsPage } from "@/components/pages/all-donors"
import { BloodRequestsPage } from "@/components/pages/blood-requests"
import { NotificationsPage } from "@/components/pages/notifications"
import { DashboardPage } from "@/components/pages/dashboard"
import { ThalassemiaPage } from "@/components/pages/thalassemia"
import { AdminLoginPage } from "@/components/pages/admin-login"
import { AnalyticsPage } from "@/components/pages/analytics"
import { EmergencyPage } from "@/components/pages/emergency"
import { RegisterDonorPage } from "@/components/pages/register-donor"
import { HospitalMapPage } from "@/components/pages/hospital-map"
import { SecurityDashboard } from "@/components/security/security-dashboard"
import { SecureLoginPage } from "@/components/security/secure-login"

type PageType =
  | "home"
  | "register"
  | "find-blood"
  | "all-donors"
  | "blood-requests"
  | "notifications"
  | "dashboard"
  | "thalassemia"
  | "admin-login"
  | "analytics"
  | "emergency"
  | "hospital-map"
  | "security-dashboard"
  | "secure-login"

interface MenuItem {
  id: PageType
  label: string
  icon: any
  description: string
  urgent?: boolean
  badge?: string
  color?: string
}

interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: Date
  actions?: Array<{
    label: string
    action: string
    type: "emergency" | "info" | "navigation"
  }>
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Heart,
    description: "Main dashboard and overview",
    color: "text-red-600",
  },
  {
    id: "register",
    label: "Register Donor",
    icon: UserPlus,
    description: "Join as a blood donor",
    color: "text-blue-600",
  },
  {
    id: "find-blood",
    label: "Find Blood",
    icon: Search,
    description: "Search for blood donors",
    color: "text-green-600",
  },
  {
    id: "hospital-map",
    label: "Hospital Map",
    icon: MapPin,
    description: "Find nearby hospitals with GPS",
    color: "text-purple-600",
    badge: "GPS",
  },
  {
    id: "all-donors",
    label: "All Donors",
    icon: Users,
    description: "Browse registered donors",
    color: "text-indigo-600",
  },
  {
    id: "blood-requests",
    label: "Blood Requests",
    icon: Droplets,
    description: "View and create requests",
    color: "text-orange-600",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: AlertCircle,
    description: "24/7 emergency blood services",
    urgent: true,
    color: "text-red-700",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alerts and updates",
    color: "text-yellow-600",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Analytics and insights",
    color: "text-cyan-600",
  },
  {
    id: "thalassemia",
    label: "Thalassemia",
    icon: Stethoscope,
    description: "Specialized patient support",
    color: "text-pink-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: Activity,
    description: "Advanced data insights",
    color: "text-emerald-600",
  },
  {
    id: "security-dashboard",
    label: "Security Center",
    icon: Shield,
    description: "Cybersecurity monitoring",
    color: "text-blue-700",
    badge: "SECURE",
  },
  {
    id: "secure-login",
    label: "Secure Access",
    icon: Lock,
    description: "Advanced authentication",
    color: "text-purple-700",
    badge: "2FA",
  },
  {
    id: "admin-login",
    label: "Admin Login",
    icon: Shield,
    description: "Administrative access",
    color: "text-gray-600",
  },
]

export default function LifePulsePage() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [notifications, setNotifications] = useState(12)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()
  const { location, requestLocation } = useLocation()
  const { isOnline, pendingRequests } = useOffline()

  // Auto-request location on mount
  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  // Initialize chatbot with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      message:
        "👋 Hello! I'm your LifePulse Security Assistant. I can help you with blood donation information, emergency services, hospital locations, cybersecurity features, and more. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      actions: [
        { label: "🚨 Emergency Help", action: "emergency", type: "emergency" },
        { label: "🏥 Find Hospital", action: "hospital-map", type: "navigation" },
        { label: "🔒 Security Center", action: "security-dashboard", type: "navigation" },
        { label: "🔐 Secure Login", action: "secure-login", type: "navigation" },
      ],
    }
    setChatMessages([welcomeMessage])
  }, [])

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page)
    setIsSidebarOpen(false)

    // Show toast for page navigation
    const pageItem = menuItems.find((item) => item.id === page)
    if (pageItem) {
      toast({
        title: `Navigating to ${pageItem.label}`,
        description: pageItem.description,
      })
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: chatInput,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    try {
      const response = await chatbot.sendMessage(chatInput)

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: response.message,
          sender: "bot",
          timestamp: new Date(),
          actions: response.actions,
        }
        setChatMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      setIsTyping(false)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message:
          "I'm sorry, I'm having trouble responding right now. Please try again or contact our emergency hotline at 1-800-LIFEPULSE for urgent matters.",
        sender: "bot",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleChatAction = (action: string, type: string) => {
    if (type === "navigation") {
      handlePageChange(action as PageType)
      setIsChatOpen(false)
    } else if (type === "emergency") {
      handlePageChange("emergency")
      setIsChatOpen(false)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "register":
        return <RegisterDonorPage />
      case "find-blood":
        return <FindBloodPage />
      case "hospital-map":
        return <HospitalMapPage />
      case "all-donors":
        return <AllDonorsPage />
      case "blood-requests":
        return <BloodRequestsPage />
      case "notifications":
        return <NotificationsPage />
      case "dashboard":
        return <DashboardPage />
      case "thalassemia":
        return <ThalassemiaPage />
      case "admin-login":
        return <AdminLoginPage />
      case "analytics":
        return <AnalyticsPage />
      case "emergency":
        return <EmergencyPage />
      case "security-dashboard":
        return <SecurityDashboard />
      case "secure-login":
        return <SecureLoginPage />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl border border-red-200 dark:border-red-800">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-600 text-white mb-8">
          <Heart className="w-5 h-5 mr-2" />
          <span className="font-semibold">LifePulse v11 - Cybersecurity Enhanced</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Save Lives with
          <span className="text-red-600 block">Secure Blood Banking</span>
        </h1>

        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Military-grade cybersecurity meets AI-powered blood donation platform. Advanced threat detection, encrypted
          data, and secure authentication protecting healthcare information across 156+ cities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => handlePageChange("register")}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Become a Donor
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
            onClick={() => handlePageChange("find-blood")}
          >
            <Search className="w-5 h-5 mr-2" />
            Find Blood Now
          </Button>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => handlePageChange("security-dashboard")}
          >
            <Shield className="w-5 h-5 mr-2" />
            Security Center
          </Button>
        </div>
      </div>

      {/* Security Features Banner */}
      <Card className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Advanced Cybersecurity</h3>
                <p className="text-blue-700 dark:text-blue-300">Military-grade protection for healthcare data</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-green-600 text-white">AES-256 Encrypted</Badge>
              <Badge className="bg-blue-600 text-white">HIPAA Compliant</Badge>
              <Badge className="bg-purple-600 text-white">Real-time Monitoring</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Statistics */}
      <LiveStats />

      {/* Cybersecurity Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Security Dashboard",
            description: "Real-time threat monitoring",
            icon: Shield,
            color: "bg-blue-600 hover:bg-blue-700",
            textColor: "text-blue-600",
            action: () => handlePageChange("security-dashboard"),
          },
          {
            title: "Secure Authentication",
            description: "Multi-factor login system",
            icon: Lock,
            color: "bg-purple-600 hover:bg-purple-700",
            textColor: "text-purple-600",
            action: () => handlePageChange("secure-login"),
          },
          {
            title: "Emergency Request",
            description: "Encrypted urgent requests",
            icon: AlertCircle,
            color: "bg-red-600 hover:bg-red-700",
            textColor: "text-red-600",
            action: () => handlePageChange("emergency"),
          },
          {
            title: "Hospital Map",
            description: "Secure GPS navigation",
            icon: MapPin,
            color: "bg-green-600 hover:bg-green-700",
            textColor: "text-green-600",
            action: () => handlePageChange("hospital-map"),
          },
        ].map((action, index) => (
          <Card
            key={index}
            className="cursor-pointer border-2 hover:shadow-lg transition-shadow"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-16 h-16 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors`}
              >
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold ${action.textColor} mb-2`}>{action.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Map */}
      <RealTimeMap />

      {/* Impact Statistics with Security Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Lives Saved",
            value: 8541,
            icon: Heart,
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/30",
          },
          {
            label: "Threats Blocked",
            value: 2847,
            icon: Shield,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            label: "Secure Sessions",
            value: 15247,
            icon: Lock,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
          },
          {
            label: "Security Score",
            value: 99.8,
            suffix: "%",
            icon: Activity,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/30",
          },
        ].map((stat, index) => (
          <Card key={index} className="text-center border-2">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side - Menu Toggle */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-2 bg-transparent"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">LifePulse</h1>
                  <Badge className="text-xs bg-red-600 text-white font-semibold">v11 Secure</Badge>
                </div>
              </div>

              {/* Security Status Display */}
              <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Security Active</span>
                <Badge className="bg-green-600 text-white text-xs font-semibold">Protected</Badge>
              </div>

              {/* GPS Location Display */}
              {location && (
                <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Navigation className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-mono text-purple-700 dark:text-purple-300">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                  <Badge className="bg-purple-600 text-white text-xs font-semibold">GPS</Badge>
                </div>
              )}
            </div>

            {/* Right Side - Header Actions */}
            <div className="flex items-center space-x-3">
              {/* Online/Offline Status */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg border">
                {isOnline ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
              </div>

              {/* Security Center Quick Access */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("security-dashboard")}
                className="relative border-2 border-blue-200 dark:border-blue-700"
              >
                <Shield className="w-5 h-5 text-blue-600" />
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold">
                  ✓
                </Badge>
              </Button>

              {/* Notifications */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("notifications")}
                className="relative border-2"
              >
                <Bell className="w-5 h-5" />
                {(notifications > 0 || pendingRequests > 0) && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold">
                    {notifications + pendingRequests}
                  </Badge>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button variant="outline" size="sm" onClick={toggleDarkMode} className="border-2 bg-transparent">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-800 border-r-2 border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Navigation Menu</h2>

          {/* Security Status (Mobile) */}
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Security Status</span>
              </div>
              <Badge className="bg-green-600 text-white text-xs font-semibold">Protected</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AES-256 Encryption • Real-time Monitoring • Threat Detection Active
            </p>
          </div>

          {/* GPS Location (Mobile) */}
          {location && (
            <div className="mb-6 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Current Location</span>
                </div>
                <Badge className="bg-purple-600 text-white text-xs font-semibold">GPS Active</Badge>
              </div>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="lg"
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full justify-start h-auto p-4 border-2 ${
                    currentPage === item.id
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${item.urgent ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : ""}`}
                >
                  <div className="flex flex-col items-start space-y-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={`w-5 h-5 ${currentPage === item.id || item.urgent ? "text-white" : item.color}`}
                        />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.urgent && <Badge className="bg-white text-red-600 text-xs font-bold">URGENT</Badge>}
                        {item.badge && (
                          <Badge
                            className={`${item.badge === "SECURE" || item.badge === "2FA" ? "bg-blue-600" : "bg-purple-600"} text-white text-xs font-semibold`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs ${currentPage === item.id || item.urgent ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {item.description}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 transition-all duration-300 ${isSidebarOpen ? "ml-80" : ""}`}>
        {renderCurrentPage()}
      </main>

      {/* Enhanced Chatbot - Left Side */}
      <div className="fixed bottom-6 left-6 z-50">
        {isChatOpen && (
          <Card className="w-96 h-96 mb-4 shadow-2xl border-2 border-blue-200 dark:border-blue-700">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>LifePulse Security Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-blue-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-80">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === "bot" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                          {message.sender === "user" && <User className="w-4 h-4 mt-1" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            {message.actions && (
                              <div className="mt-3 space-y-2">
                                {message.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={action.type === "emergency" ? "destructive" : "outline"}
                                    onClick={() => handleChatAction(action.action, action.type)}
                                    className="w-full text-xs"
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Security Assistant is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about security, blood donation, emergencies..."
                    className="flex-1 border-2"
                  />
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-2xl border-4 border-white dark:border-gray-800"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>

      {/* Emergency Floating Button - Right Side */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-2xl border-4 border-white dark:border-gray-800"
          onClick={() => handlePageChange("emergency")}
        >
          <AlertCircle className="w-8 h-8" />
        </Button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
