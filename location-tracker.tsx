"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Navigation,
  RefreshCw,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { useToast } from "@/hooks/use-toast"

interface LocationTrackerProps {
  showCard?: boolean
  compact?: boolean
}

export function LocationTracker({ showCard = true, compact = false }: LocationTrackerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isWatching, setIsWatching] = useState(false)
  const { location, error, loading, permission, requestLocation, watchLocation, stopWatching } = useLocation()
  const { toast } = useToast()

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return { icon: CheckCircle, color: "text-green-500", text: "Location Access Granted" }
      case "denied":
        return { icon: AlertCircle, color: "text-red-500", text: "Location Access Denied" }
      case "prompt":
        return { icon: Clock, color: "text-yellow-500", text: "Location Permission Required" }
      default:
        return { icon: AlertCircle, color: "text-gray-500", text: "Checking Location Permission" }
    }
  }

  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy <= 10) return { level: "Very High", color: "bg-green-500", text: "GPS Accurate" }
    if (accuracy <= 50) return { level: "High", color: "bg-blue-500", text: "Good Signal" }
    if (accuracy <= 100) return { level: "Medium", color: "bg-yellow-500", text: "Fair Signal" }
    return { level: "Low", color: "bg-red-500", text: "Poor Signal" }
  }

  const copyCoordinates = () => {
    if (location) {
      const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
      navigator.clipboard.writeText(coords)
      toast({
        title: "Coordinates Copied",
        description: `${coords} copied to clipboard`,
      })
    }
  }

  const openInMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      window.open(url, "_blank")
    }
  }

  const handleWatchToggle = () => {
    if (isWatching) {
      stopWatching()
      setIsWatching(false)
      toast({
        title: "Location Tracking Stopped",
        description: "No longer monitoring location changes",
      })
    } else {
      watchLocation()
      setIsWatching(true)
      toast({
        title: "Location Tracking Started",
        description: "Now monitoring location changes",
      })
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const permissionStatus = getPermissionStatus()
  const accuracyInfo = location ? getAccuracyLevel(location.accuracy) : null

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        {isVisible && location && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-mono">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
            <Badge className={`${accuracyInfo?.color} text-white text-xs`}>{accuracyInfo?.level}</Badge>
          </div>
        )}
      </div>
    )
  }

  if (!showCard || !isVisible) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsVisible(true)}>
        <MapPin className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Navigation className="w-5 h-5 mr-2 text-blue-500" />
            GPS Location Tracker
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {navigator.onLine ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Permission Status */}
        <Alert
          className={
            permission === "granted"
              ? "border-green-500"
              : permission === "denied"
                ? "border-red-500"
                : "border-yellow-500"
          }
        >
          <permissionStatus.icon className={`h-4 w-4 ${permissionStatus.color}`} />
          <AlertDescription className="flex items-center justify-between">
            <span>{permissionStatus.text}</span>
            {permission === "denied" && (
              <Button variant="outline" size="sm" onClick={requestLocation}>
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>

        {/* Location Information */}
        {location && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Latitude</p>
                <p className="font-mono font-medium">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Longitude</p>
                <p className="font-mono font-medium">{location.longitude.toFixed(6)}</p>
              </div>
            </div>

            {accuracyInfo && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accuracy</span>
                <div className="flex items-center space-x-2">
                  <Badge className={`${accuracyInfo.color} text-white text-xs`}>{accuracyInfo.level}</Badge>
                  <span className="text-xs text-muted-foreground">±{Math.round(location.accuracy)}m</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-xs text-muted-foreground">{formatTimestamp(location.timestamp)}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription>
              <div>
                <p className="font-medium">Location Error</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestLocation}
            disabled={loading}
            className="flex-1 bg-transparent"
          >
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
            {loading ? "Getting Location..." : "Get Location"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchToggle}
            className={`flex-1 ${isWatching ? "bg-blue-50 border-blue-500 text-blue-600" : ""}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isWatching ? "Stop Watching" : "Watch Location"}
          </Button>
        </div>

        {location && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyCoordinates} className="flex-1 bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              Copy Coords
            </Button>
            <Button variant="outline" size="sm" onClick={openInMaps} className="flex-1 bg-transparent">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        )}

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground text-center">
          {permission === "granted"
            ? "Location services active. Your privacy is protected."
            : permission === "denied"
              ? "Enable location access in browser settings for full functionality."
              : "Click 'Get Location' to enable GPS tracking for better service."}
        </div>
      </CardContent>
    </Card>
  )
}
