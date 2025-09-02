"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Target, Timer, CheckCircle, Star, Download, Activity, Users, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AnimatedCounter } from "@/components/interactive/animated-counter"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalDonors: number
  successfulMatches: number
  responseTime: number
  satisfactionRate: number
  monthlyGrowth: number
  citiesCovered: number
}

export function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalDonors: 1247,
    successfulMatches: 1834,
    responseTime: 4.3,
    satisfactionRate: 4.9,
    monthlyGrowth: 23.5,
    citiesCovered: 156,
  })
  const { toast } = useToast()

  const bloodTypeData = [
    { type: "O+", percentage: 35, demand: "High", availability: "Good" },
    { type: "A+", percentage: 28, demand: "High", availability: "Good" },
    { type: "B+", percentage: 20, demand: "Medium", availability: "Good" },
    { type: "AB+", percentage: 8, demand: "Low", availability: "Good" },
    { type: "O-", percentage: 4, demand: "Critical", availability: "Low" },
    { type: "A-", percentage: 3, demand: "Medium", availability: "Low" },
    { type: "B-", percentage: 2, demand: "Medium", availability: "Critical" },
    { type: "AB-", percentage: 1, demand: "Low", availability: "Critical" },
  ]

  const regionalData = [
    { region: "Mumbai", donors: 234, requests: 189, fulfillment: 94 },
    { region: "Delhi", donors: 198, requests: 156, fulfillment: 92 },
    { region: "Bangalore", donors: 167, requests: 134, fulfillment: 96 },
    { region: "Chennai", donors: 145, requests: 123, fulfillment: 89 },
    { region: "Hyderabad", donors: 134, requests: 98, fulfillment: 91 },
  ]

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report is being prepared for download`,
    })
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Critical":
        return "text-red-600 bg-red-100"
      case "High":
        return "text-orange-600 bg-orange-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-green-600 bg-green-100"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Critical":
        return "text-red-600 bg-red-100"
      case "Low":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-green-600 bg-green-100"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">AI-Powered Analytics</h1>
        <p className="text-xl text-muted-foreground">
          Advanced insights and predictive analytics for optimized blood bank operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Prediction Accuracy",
            value: 98.7,
            icon: Target,
            suffix: "%",
            color: "blue",
            trend: "+2.3%",
          },
          {
            label: "Response Time",
            value: 4.3,
            icon: Timer,
            suffix: " min",
            color: "green",
            trend: "-0.8 min",
          },
          {
            label: "Success Rate",
            value: 94.2,
            icon: CheckCircle,
            suffix: "%",
            color: "purple",
            trend: "+1.2%",
          },
          {
            label: "User Satisfaction",
            value: 4.9,
            icon: Star,
            suffix: "/5",
            color: "yellow",
            trend: "+0.2",
          },
        ].map((metric, index) => (
          <Card key={index} className="glass-card text-center p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-8 h-8 text-${metric.color}-500`} />
              <Badge
                className={`${
                  metric.trend.startsWith("+") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {metric.trend}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter end={metric.value} suffix={metric.suffix} />
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </Card>
        ))}
      </div>

      {/* Blood Type Analytics */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
            Blood Type Distribution & Demand Analysis
            <Badge className="ml-2 bg-purple-100 text-purple-600">Real-time Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Current Distribution</h4>
              {bloodTypeData.map((blood) => (
                <div key={blood.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm font-medium">{blood.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{blood.percentage}%</span>
                  </div>
                  <Progress value={blood.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Demand vs Availability</h4>
              <div className="space-y-3">
                {bloodTypeData.map((blood) => (
                  <div
                    key={blood.type}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      <span className="font-medium">{blood.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getDemandColor(blood.demand)}`}>{blood.demand}</Badge>
                      <Badge className={`text-xs ${getAvailabilityColor(blood.availability)}`}>
                        {blood.availability}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Regional Performance Analysis
            <Badge className="ml-2 bg-green-100 text-green-600">Top 5 Cities</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionalData.map((region, index) => (
              <div key={region.region} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? "bg-gold" : index === 1 ? "bg-silver" : index === 2 ? "bg-bronze" : "bg-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-foreground ml-3">{region.region}</h4>
                  </div>
                  <Badge
                    className={`${
                      region.fulfillment >= 95
                        ? "bg-green-500"
                        : region.fulfillment >= 90
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    } text-white`}
                  >
                    {region.fulfillment}% Success
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{region.donors}</div>
                    <div className="text-muted-foreground">Active Donors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{region.requests}</div>
                    <div className="text-muted-foreground">Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{region.fulfillment}%</div>
                    <div className="text-muted-foreground">Fulfillment</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            AI Predictive Insights
            <Badge className="ml-2 bg-blue-100 text-blue-600">Machine Learning</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Next 7 Days Forecast</h4>
              <div className="space-y-3">
                {["O+", "A+", "B+", "AB+"].map((type) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={Math.floor(Math.random() * 40) + 30} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 20) + 10} units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Key Insights</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Peak demand hours: 10 AM - 2 PM
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Highest success rate: Mumbai region (96.2%)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Most requested: O+ blood type (35%)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Response time improved by 23% this month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Emergency cases resolved: 99.1%
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Reports */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-500" />
            Generate Comprehensive Reports
            <Badge className="ml-2 bg-blue-100 text-blue-600">Export Ready</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Monthly Analytics Summary",
                description: "Comprehensive monthly analytics with AI insights and trends",
                format: "PDF",
                icon: BarChart3,
                color: "blue",
              },
              {
                title: "Donor Behavior Analysis",
                description: "Detailed donor behavior patterns and engagement metrics",
                format: "Excel",
                icon: Users,
                color: "green",
              },
              {
                title: "Performance Dashboard",
                description: "System performance metrics and operational efficiency",
                format: "PDF",
                icon: Activity,
                color: "purple",
              },
            ].map((report, index) => (
              <div key={index} className="p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center mb-4">
                  <report.icon className={`w-8 h-8 text-${report.color}-500 mr-3`} />
                  <Badge className={`bg-${report.color}-100 text-${report.color}-600`}>{report.format}</Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{report.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <Button
                  size="sm"
                  className={`w-full bg-gradient-to-r from-${report.color}-500 to-${report.color}-600 hover:from-${report.color}-600 hover:to-${report.color}-700`}
                  onClick={() => handleDownloadReport(report.title)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {report.format}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
