"use client"

import { useState } from "react"
import { Settings, User, Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (formData: FormData) => {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (username === "admin" && password === "lifepulse2024") {
        toast({
          title: "Login Successful",
          description: "Welcome to LifePulse Admin Dashboard",
        })
        setLoginAttempts(0)
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (newAttempts >= 3) {
          setIsLocked(true)
          toast({
            title: "Account Locked",
            description: "Too many failed login attempts. Account locked for security.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login Failed",
            description: `Invalid credentials. ${3 - newAttempts} attempts remaining.`,
            variant: "destructive",
          })
        }
      }
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Admin Portal</h1>
        <p className="text-lg text-muted-foreground">Secure access to LifePulse administration dashboard</p>
        <Badge className="mt-2 bg-blue-100 text-blue-600">Enhanced Security v11</Badge>
      </div>

      {/* Security Status */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">Security Status</span>
            </div>
            <Badge className="bg-green-100 text-green-600">Active</Badge>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            SSL Encrypted • Multi-factor Authentication • Session Monitoring
          </div>
        </CardContent>
      </Card>

      {/* Login Attempts Warning */}
      {loginAttempts > 0 && !isLocked && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {loginAttempts} failed attempt{loginAttempts > 1 ? "s" : ""}. {3 - loginAttempts} remaining before lockout.
          </AlertDescription>
        </Alert>
      )}

      {/* Account Locked Alert */}
      {isLocked && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            Account temporarily locked due to multiple failed login attempts. Please contact system administrator.
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Settings className="w-5 h-5 mr-2" />
            Administrator Login
            <Badge className="ml-2 bg-blue-100 text-blue-600">Secure Access</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground flex items-center">
                <User className="w-4 h-4 mr-2" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter admin username"
                className="form-bright"
                required
                disabled={isLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  className="form-bright pr-10"
                  required
                  disabled={isLocked}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Settings className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  {isLocked ? "Account Locked" : "Login to Dashboard"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Demo Credentials */}
      <Card className="glass-card bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-semibold text-foreground">Demo Credentials</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-white dark:bg-gray-700 rounded border">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-mono font-bold ml-2">admin</span>
            </div>
            <div className="p-2 bg-white dark:bg-gray-700 rounded border">
              <span className="text-muted-foreground">Password:</span>
              <span className="font-mono font-bold ml-2">lifepulse2024</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Use these credentials for demonstration purposes</p>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Security Features</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>SSL Encryption</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Session Timeout</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Audit Logging</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>IP Monitoring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { AdminLoginPage as default }
