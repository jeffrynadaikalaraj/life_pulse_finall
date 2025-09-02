"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, Shield, Eye, EyeOff, Fingerprint, Smartphone, Key, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { SecurityUtils, ThreatDetector, SessionManager, AuditLogger } from "@/lib/security"

interface AuthStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
}

export function SecureLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginStep, setLoginStep] = useState<"credentials" | "2fa" | "biometric" | "success">("credentials")
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: "credentials",
      title: "Username & Password",
      description: "Enter your login credentials",
      completed: false,
      current: true,
    },
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: "Verify with your authenticator app",
      completed: false,
      current: false,
    },
    {
      id: "biometric",
      title: "Biometric Verification",
      description: "Fingerprint or face recognition",
      completed: false,
      current: false,
    },
    { id: "success", title: "Access Granted", description: "Welcome to secure area", completed: false, current: false },
  ])
  const [securityFeatures] = useState([
    { name: "AES-256 Encryption", status: "active", icon: Lock },
    { name: "Multi-Factor Auth", status: "active", icon: Shield },
    { name: "Biometric Login", status: "active", icon: Fingerprint },
    { name: "Session Monitoring", status: "active", icon: Eye },
    { name: "Threat Detection", status: "active", icon: AlertCircle },
    { name: "Audit Logging", status: "active", icon: Clock },
  ])

  const { toast } = useToast()

  useEffect(() => {
    // Calculate password strength
    const calculateStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      return strength
    }

    setPasswordStrength(calculateStrength(credentials.password))
  }, [credentials.password])

  const updateAuthStep = (stepId: string, completed: boolean, current: boolean) => {
    setAuthSteps((prev) =>
      prev.map((step) => ({
        ...step,
        completed: step.id === stepId ? completed : step.completed,
        current: step.id === stepId ? current : false,
      })),
    )
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check for brute force attempts
    if (ThreatDetector.detectBruteForce(credentials.username)) {
      toast({
        title: "Account Temporarily Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      })
      AuditLogger.log("login_blocked_brute_force", { username: credentials.username }, "high")
      return
    }

    // Validate input
    if (!SecurityUtils.validateInput(credentials.username) || !SecurityUtils.validateInput(credentials.password)) {
      toast({
        title: "Invalid Input Detected",
        description: "Potentially malicious input blocked.",
        variant: "destructive",
      })
      AuditLogger.log("malicious_input_blocked", { username: credentials.username }, "high")
      return
    }

    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      if (credentials.username === "admin" && credentials.password === "SecurePass123!") {
        updateAuthStep("credentials", true, false)
        updateAuthStep("2fa", false, true)
        setLoginStep("2fa")
        ThreatDetector.resetAttempts(credentials.username)
        AuditLogger.log("credentials_verified", { username: credentials.username }, "low")
        toast({
          title: "Credentials Verified",
          description: "Proceeding to two-factor authentication.",
        })
      } else {
        ThreatDetector.recordFailedAttempt(credentials.username)
        AuditLogger.log("login_failed", { username: credentials.username }, "medium")
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 2000)
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate 2FA verification
    setTimeout(() => {
      if (twoFactorCode === "123456") {
        updateAuthStep("2fa", true, false)
        updateAuthStep("biometric", false, true)
        setLoginStep("biometric")
        AuditLogger.log("2fa_verified", { username: credentials.username }, "low")
        toast({
          title: "2FA Verified",
          description: "Proceeding to biometric verification.",
        })
      } else {
        AuditLogger.log("2fa_failed", { username: credentials.username }, "medium")
        toast({
          title: "2FA Failed",
          description: "Invalid verification code.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleBiometricAuth = async () => {
    setIsLoading(true)

    // Simulate biometric authentication
    setTimeout(() => {
      updateAuthStep("biometric", true, false)
      updateAuthStep("success", true, true)
      setLoginStep("success")

      // Create secure session
      const sessionId = SessionManager.createSession(credentials.username)
      AuditLogger.log("biometric_verified", { username: credentials.username, sessionId }, "low")

      toast({
        title: "Biometric Verified",
        description: "Access granted. Welcome to the secure area.",
      })
      setIsLoading(false)
    }, 2000)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak"
    if (passwordStrength < 50) return "Weak"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Secure Authentication Portal</h1>
        <p className="text-lg text-muted-foreground">Multi-layered security with advanced threat protection</p>
        <Badge className="mt-2 bg-blue-100 text-blue-600">Military-Grade Security</Badge>
      </div>

      {/* Authentication Progress */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Authentication Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {authSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-600 text-white"
                      : step.current
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${step.current ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-600"}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authentication Form */}
        <div className="space-y-6">
          {loginStep === "credentials" && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-blue-600" />
                  Step 1: Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                      className="border-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="border-2 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {credentials.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Password Strength</span>
                          <span
                            className={
                              passwordStrength >= 75
                                ? "text-green-600"
                                : passwordStrength >= 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <>
                        <Lock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Verify Credentials
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {loginStep === "2fa" && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                  Step 2: Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handle2FASubmit} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="2fa-code" className="text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="2fa-code"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="000000"
                      className="border-2 text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || twoFactorCode.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Smartphone className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </form>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Demo code: <strong>123456</strong>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {loginStep === "biometric" && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fingerprint className="w-5 h-5 mr-2 text-purple-600" />
                  Step 3: Biometric Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Fingerprint className="w-12 h-12 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Biometric Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Place your finger on the sensor or look at the camera for face recognition
                    </p>
                  </div>

                  <Button
                    onClick={handleBiometricAuth}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Start Biometric Scan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loginStep === "success" && (
            <Card className="border-2 border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">Access Granted!</h3>
                <p className="text-green-700 dark:text-green-300 mb-6">
                  You have successfully completed multi-factor authentication. Welcome to the secure area.
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge className="bg-green-600 text-white">Authenticated</Badge>
                  <Badge className="bg-blue-600 text-white">Session Active</Badge>
                  <Badge className="bg-purple-600 text-white">Encrypted</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security Features Panel */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Active Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <Badge className="bg-green-600 text-white">{feature.status.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>End-to-End Encryption:</strong> All data is encrypted using AES-256 encryption both in transit
                  and at rest.
                </AlertDescription>
              </Alert>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Zero Trust Architecture:</strong> Every request is verified regardless of location or user
                  credentials.
                </AlertDescription>
              </Alert>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Continuous Monitoring:</strong> All activities are logged and monitored for suspicious
                  behavior.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
