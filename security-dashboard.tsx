"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Activity, Users, Lock, Eye, TrendingUp, Clock, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuditLogger, SessionManager } from "@/lib/security"
import { useToast } from "@/hooks/use-toast"

interface SecurityMetrics {
  threatsBlocked: number
  activeSessions: number
  securityScore: number
  lastScan: string
  vulnerabilities: number
  encryptedData: number
}

interface ThreatAlert {
  id: string
  type: "brute_force" | "sql_injection" | "xss" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: number
  description: string
  source: string
  status: "active" | "resolved" | "investigating"
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatsBlocked: 2847,
    activeSessions: 156,
    securityScore: 98.7,
    lastScan: "2 minutes ago",
    vulnerabilities: 0,
    encryptedData: 100,
  })

  const [threats, setThreats] = useState<ThreatAlert[]>([
    {
      id: "1",
      type: "brute_force",
      severity: "high",
      timestamp: Date.now() - 300000,
      description: "Multiple failed login attempts detected from IP 192.168.1.100",
      source: "192.168.1.100",
      status: "resolved",
    },
    {
      id: "2",
      type: "suspicious_activity",
      severity: "medium",
      timestamp: Date.now() - 600000,
      description: "Unusual data access pattern detected for user ID 12345",
      source: "User Dashboard",
      status: "investigating",
    },
    {
      id: "3",
      type: "sql_injection",
      severity: "critical",
      timestamp: Date.now() - 900000,
      description: "SQL injection attempt blocked on donor search endpoint",
      source: "/api/donors/search",
      status: "resolved",
    },
  ])

  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load audit logs
    setAuditLogs(AuditLogger.getLogs(50))

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeSessions: SessionManager.getActiveSessionsCount(),
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        securityScore: Math.min(99.9, prev.securityScore + (Math.random() - 0.5) * 0.1),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleThreatAction = (threatId: string, action: "resolve" | "investigate") => {
    setThreats((prev) =>
      prev.map((threat) =>
        threat.id === threatId ? { ...threat, status: action === "resolve" ? "resolved" : "investigating" } : threat,
      ),
    )

    toast({
      title: `Threat ${action === "resolve" ? "Resolved" : "Under Investigation"}`,
      description: `Security threat has been marked as ${action === "resolve" ? "resolved" : "under investigation"}.`,
    })

    AuditLogger.log(`threat_${action}`, { threatId, action }, "medium", "security_admin")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-600 text-white"
      case "investigating":
        return "bg-yellow-600 text-white"
      case "active":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Security Command Center</h1>
        <p className="text-lg text-muted-foreground">Real-time cybersecurity monitoring and threat detection</p>
        <Badge className="mt-2 bg-blue-100 text-blue-600">Military-Grade Protection</Badge>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Threats Blocked",
            value: metrics.threatsBlocked.toLocaleString(),
            icon: Shield,
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            change: "+12 today",
          },
          {
            title: "Active Sessions",
            value: metrics.activeSessions.toString(),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            change: "Normal activity",
          },
          {
            title: "Security Score",
            value: `${metrics.securityScore.toFixed(1)}%`,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            change: "Excellent",
          },
          {
            title: "Data Encrypted",
            value: `${metrics.encryptedData}%`,
            icon: Lock,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            change: "AES-256",
          },
        ].map((metric, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-muted-foreground mb-2">{metric.title}</div>
              <div className="text-xs text-green-600 font-medium">{metric.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Status */}
      <Card className="border-2 border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">System Security Status</h3>
                <p className="text-green-700 dark:text-green-300">
                  All systems operational - Last scan: {metrics.lastScan}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-green-600 text-white">Protected</Badge>
              <Badge className="bg-blue-600 text-white">Monitored</Badge>
              <Badge className="bg-purple-600 text-white">Encrypted</Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Security Score</span>
              <span>{metrics.securityScore.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.securityScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="threats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Threat Detection Tab */}
        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Active Threats & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {threats.map((threat) => (
                    <Alert key={threat.id} className="border-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getSeverityColor(threat.severity)}>
                                {threat.severity.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(threat.status)}>{threat.status.toUpperCase()}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(threat.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-1">{threat.description}</p>
                            <p className="text-xs text-muted-foreground">Source: {threat.source}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {threat.status === "active" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleThreatAction(threat.id, "investigate")}
                                >
                                  Investigate
                                </Button>
                                <Button size="sm" onClick={() => handleThreatAction(threat.id, "resolve")}>
                                  Resolve
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Real-time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { event: "User login successful", time: "2 seconds ago", type: "success" },
                    { event: "Data encryption completed", time: "15 seconds ago", type: "info" },
                    { event: "Security scan initiated", time: "1 minute ago", type: "info" },
                    { event: "Suspicious IP blocked", time: "3 minutes ago", type: "warning" },
                    { event: "Backup completed", time: "5 minutes ago", type: "success" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">{activity.event}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="w-5 h-5 mr-2 text-green-600" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Firewall Status</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Intrusion Detection</span>
                    <Badge className="bg-green-600 text-white">Monitoring</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <Badge className="bg-green-600 text-white">Valid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">DDoS Protection</span>
                    <Badge className="bg-green-600 text-white">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "HIPAA Compliance",
                status: "Compliant",
                score: 98,
                lastAudit: "2024-01-15",
                color: "green",
              },
              {
                title: "GDPR Compliance",
                status: "Compliant",
                score: 96,
                lastAudit: "2024-01-10",
                color: "green",
              },
              {
                title: "ISO 27001",
                status: "Certified",
                score: 94,
                lastAudit: "2024-01-05",
                color: "blue",
              },
              {
                title: "SOC 2 Type II",
                status: "Compliant",
                score: 97,
                lastAudit: "2024-01-12",
                color: "purple",
              },
            ].map((compliance, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{compliance.title}</span>
                    <Badge className={`bg-${compliance.color}-600 text-white`}>{compliance.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Compliance Score</span>
                        <span>{compliance.score}%</span>
                      </div>
                      <Progress value={compliance.score} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">Last Audit: {compliance.lastAudit}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-gray-600" />
                Security Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {auditLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="text-sm font-medium">{log.event}</span>
                          {log.userId && <span className="text-xs text-muted-foreground ml-2">User: {log.userId}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
