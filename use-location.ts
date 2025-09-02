"use client"

import { useState, useEffect, useCallback } from "react"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface LocationError {
  code: number
  message: string
}

interface UseLocationReturn {
  location: LocationData | null
  error: LocationError | null
  loading: boolean
  permission: PermissionState | null
  requestLocation: () => void
  watchLocation: () => void
  stopWatching: () => void
  calculateDistance: (lat2: number, lon2: number) => number | null
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState<PermissionState | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  // Check geolocation permission
  useEffect(() => {
    if (typeof window !== "undefined" && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermission(result.state)
        result.addEventListener("change", () => {
          setPermission(result.state)
        })
      })
    }
  }, [])

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback(
    (lat2: number, lon2: number): number | null => {
      if (!location) return null

      const R = 6371 // Earth's radius in kilometers
      const dLat = ((lat2 - location.latitude) * Math.PI) / 180
      const dLon = ((lon2 - location.longitude) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((location.latitude * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },
    [location],
  )

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser",
      })
      return
    }

    setLoading(true)
    setError(null)

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Cache for 1 minute
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }
        setLocation(locationData)
        setLoading(false)

        // Store in localStorage for offline use
        if (typeof window !== "undefined") {
          localStorage.setItem("lastKnownLocation", JSON.stringify(locationData))
        }
      },
      (error) => {
        setError({
          code: error.code,
          message: error.message,
        })
        setLoading(false)

        // Try to load from localStorage if available
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("lastKnownLocation")
          if (stored) {
            try {
              const parsedLocation = JSON.parse(stored)
              setLocation(parsedLocation)
            } catch (e) {
              console.error("Failed to parse stored location:", e)
            }
          }
        }
      },
      options,
    )
  }, [])

  // Request location permission and get position
  const requestLocation = useCallback(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  // Watch position changes
  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser",
      })
      return
    }

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // Cache for 30 seconds when watching
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }
        setLocation(locationData)
        setError(null)

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("lastKnownLocation", JSON.stringify(locationData))
        }
      },
      (error) => {
        setError({
          code: error.code,
          message: error.message,
        })
      },
      options,
    )

    setWatchId(id)
  }, [watchId])

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  // Auto-request location on mount if permission is granted
  useEffect(() => {
    if (permission === "granted") {
      getCurrentPosition()
    }
  }, [permission, getCurrentPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    location,
    error,
    loading,
    permission,
    requestLocation,
    watchLocation,
    stopWatching,
    calculateDistance,
  }
}
