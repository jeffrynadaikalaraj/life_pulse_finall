"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Heart, Activity, RefreshCw } from "lucide-react"

interface LocationData {
  id: string
  city: string
  donors: number
  requests: number
  status: "high" | "medium" | "low"
  coordinates: { x: number; y: number }
}

export function RealTimeMap() {
  const [locations, setLocations] = useState<LocationData[]>([
    { id: "mumbai", city: "Mumbai", donors: 456, requests: 23, status: "high", coordinates: { x: 20, y: 60 } },
    { id: "delhi", city: "Delhi", donors: 389, requests: 18, status: "medium", coordinates: { x: 30, y: 25 } },
    { id: "bangalore", city: "Bangalore", donors: 234, requests: 12, status: "low", coordinates: { x: 25, y: 75 } },
    { id: "chennai", city: "Chennai", donors: 198, requests: 8, status: "low", coordinates: { x: 35, y: 85 } },
    { id: "kolkata", city: "Kolkata", donors: 167, requests: 15, status: "medium", coordinates: { x: 65, y: 45 } },
    { id: "hyderabad", city: "Hyderabad", donors: 145, requests: 9, status: "low", coordinates: { x: 40, y: 70 } },
  ])

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations((prev) =>
        prev.map((location) => ({
          ...location,
          donors: location.donors + Math.floor(Math.random() * 5) - 2,
          requests: Math.max(0, location.requests + Math.floor(Math.random() * 3) - 1),
          status: location.requests > 20 ? "high" : location.requests > 10 ? "medium" : "low",
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Live Blood Bank Network
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {/* Simplified India Map */}
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" />
            </div>

            {/* Location markers */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`,
                }}
                onClick={() => setSelectedLocation(location)}
              >
                {/* Pulsing ring */}
                <div
                  className={`absolute inset-0 w-8 h-8 ${getStatusColor(location.status)} rounded-full opacity-30 animate-ping`}
                />

                {/* Main marker */}
                <div
                  className={`relative w-6 h-6 ${getStatusColor(location.status)} rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-200`}
                >
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {location.city}
                  <div className="text-xs text-gray-300">
                    {location.donors} donors • {location.requests} requests
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 p-3 rounded-lg shadow-lg">
              <div className="text-xs font-semibold mb-2">Activity Level</div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  High Activity
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  Medium Activity
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  Low Activity
                </div>
              </div>
            </div>
          </div>

          {/* Selected location details */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{selectedLocation.city}</h3>
                <Badge className={`${getStatusColor(selectedLocation.status)} text-white`}>
                  {selectedLocation.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-2xl font-bold text-foreground">{selectedLocation.donors}</div>
                  <div className="text-xs text-muted-foreground">Active Donors</div>
                </div>
                <div className="text-center">
                  <Heart className="w-6 h-6 mx-auto mb-1 text-red-500" />
                  <div className="text-2xl font-bold text-foreground">{selectedLocation.requests}</div>
                  <div className="text-xs text-muted-foreground">Blood Requests</div>
                </div>
                <div className="text-center">
                  <Activity className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((selectedLocation.donors / (selectedLocation.requests || 1)) * 10) / 10}
                  </div>
                  <div className="text-xs text-muted-foreground">Donor/Request Ratio</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
