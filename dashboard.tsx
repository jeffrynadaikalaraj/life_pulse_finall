"use client"

import { useState, useEffect } from "react"
import { Activity, BarChart3, TrendingUp, Heart, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LiveStats } from "@/components/interactive/live-stats"
import { AnimatedCounter } from "@/components/interactive/animated-counter"

interface ActivityItem {
  id: number
  action: string
  user: string
  time: string
  type: "success" | "warning" | "info"
}

export function DashboardPage() {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  const mockActivity: ActivityItem[] = [
    { id: 1, action: "New donor registered", user: "Rajesh Kumar", time: "2 minutes ago", type: "success" },
    { id: 2, action: "Blood request fulfilled", user: "Apollo Hospital", time: "5 minutes ago", type: "success" },
    { id: 3, action: "Emergency alert sent", user: "System", time: "12 minutes ago", type: "warning" },
    { id: 4, action: "Donor contacted successfully", user: "Priya Sharma", time: "18 minutes ago", type: "info" },
    { id: 5, action: "New blood request", user: "Max Hospital", time: "25 minutes ago", type: "info" },
    { id: 6, action: "Donor verification completed", user: "Amit Patel", time: "32 minutes ago", type: "success" },
    { id: 7, action: "Low stock alert triggered", user: "System", time: "45 minutes ago", type: "warning" },
    { id: 8, action: "Monthly report generated", user: "Admin", time: "1 hour ago", type: "info" },
  ]

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    setRecentActivity(mockActivity)
  }, [])

  const getBloodTypePercentage = (type: string) => {
    const percentages: { [key: string]: number } = {
      "O+": 35,
      "A+": 28,
      "B+": 20,
      "AB+": 8,
      "O-": 4,
      "A-": 3,
      "B-": 2,
      "AB-": 1,
    }
    return percentages[type] || 0
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20"
      default:
        return "bg-blue-50 dark:bg-blue-900/20"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Live Analytics Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Real-time insights and comprehensive analytics for blood bank operations
        </p>
      </div>

      {/* Live Statistics */}
      <LiveStats />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Response Rate",
            value: 94.2,
            icon: TrendingUp,
            color: "green",
            suffix: "%",
            change: "+2.3%",
          },
          {
            label: "Average Response Time",
            value: 4.3,
            icon: Clock,
            color: "blue",
            suffix: " min",
            change: "-0.8 min",
          },
          {
            label: "Success Rate",
            value: 98.7,
            icon: CheckCircle,
            color: "purple",
            suffix: "%",
            change: "+1.2%",
          },
          {
            label: "Active Requests",
            value: 23,
            icon: Activity,
            color: "orange",
            suffix: "",
            change: "+5",
          },
        ].map((kpi, index) => (
          <Card key={index} className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <kpi.icon className={`w-8 h-8 text-${kpi.color}-500`} />
                <Badge
                  className={`${
                    kpi.change.startsWith("+") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedCounter end={kpi.value} suffix={kpi.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Blood Type Distribution
              <Badge className="ml-2 bg-blue-100 text-blue-600">Live Data</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bloodTypes.map((type) => {
                const percentage = getBloodTypePercentage(type)
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                        <Badge
                          className={`text-xs ${
                            percentage > 20 ? "bg-green-500" : percentage > 10 ? "bg-yellow-500" : "bg-red-500"
                          } text-white`}
                        >
                          {percentage > 20 ? "Good" : percentage > 10 ? "Low" : "Critical"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Monthly Performance
              <Badge className="ml-2 bg-green-100 text-green-600">Trending Up</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">New Donors This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    <AnimatedCounter end={247} prefix="+" />
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Successful Matches</p>
                  <p className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter end={1234} />
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                  <p className="text-2xl font-bold text-purple-600">
                    <AnimatedCounter end={156} />
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-500" />
              Recent Activity
              <Badge className="ml-2 bg-orange-100 text-orange-600">Live Feed</Badge>
            </div>
            <Badge className="bg-gray-100 text-gray-600">{recentActivity.length} activities</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 hover:shadow-sm ${getActivityBgColor(
                  activity.type,
                )}`}
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
