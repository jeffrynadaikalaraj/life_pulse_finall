"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Clock, FolderSyncIcon as Sync, Phone } from "lucide-react"
import { useOffline } from "@/hooks/use-offline"

export function OfflineIndicator() {
  const { isOnline, pendingRequests, lastSync } = useOffline()
  const [showDetails, setShowDetails] = useState(false)

  if (isOnline && pendingRequests === 0) {
    return null // Don't show anything when online and no pending requests
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert
        className={`${isOnline ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            <span
              className={`font-medium ${isOnline ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
            >
              {isOnline ? "Online" : "Offline Mode"}
            </span>
          </div>

          {pendingRequests > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pendingRequests} pending
            </Badge>
          )}
        </div>

        <AlertDescription
          className={`mt-2 ${isOnline ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
        >
          {isOnline ? (
            <div>
              <div>Connected to LifePulse servers</div>
              {pendingRequests > 0 && (
                <div className="flex items-center mt-1 text-sm">
                  <Sync className="h-3 w-3 mr-1 animate-spin" />
                  Syncing {pendingRequests} emergency requests...
                </div>
              )}
              {lastSync && <div className="text-xs mt-1 opacity-75">Last sync: {lastSync.toLocaleTimeString()}</div>}
            </div>
          ) : (
            <div>
              <div>Emergency features available offline</div>
              <div className="flex items-center mt-2 space-x-2">
                <Button size="sm" variant="outline" onClick={() => setShowDetails(!showDetails)} className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Emergency Contacts
                </Button>
              </div>
              {pendingRequests > 0 && (
                <div className="flex items-center mt-1 text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {pendingRequests} requests will sync when online
                </div>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>

      {showDetails && !isOnline && (
        <Alert className="mt-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <Phone className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <div className="space-y-2">
              <div className="font-medium">Emergency Contacts (Available Offline):</div>
              <div className="space-y-1 text-sm">
                <div>
                  🚨 Emergency Hotline: <strong>1-800-LIFEPULSE</strong>
                </div>
                <div>
                  🏥 Emergency Services: <strong>108</strong>
                </div>
                <div>
                  🩸 Blood Bank Network: <strong>+91 11 2659 7000</strong>
                </div>
              </div>
              <div className="text-xs opacity-75 mt-2">
                All contacts available 24/7. Your emergency requests are saved and will be sent when connection is
                restored.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
