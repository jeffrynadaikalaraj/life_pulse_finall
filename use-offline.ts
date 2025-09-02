"use client"

import { useState, useEffect } from "react"
import { offlineStorage, type OfflineEmergencyRequest } from "@/lib/offline-storage"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingRequests, setPendingRequests] = useState<OfflineEmergencyRequest[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (online && !isOnline) {
        // Just came back online, sync pending requests
        syncPendingData()
      }
    }

    const syncPendingData = async () => {
      try {
        await offlineStorage.syncPendingRequests()
        const requests = await offlineStorage.getEmergencyRequests()
        setPendingRequests(requests.filter((req) => req.status === "pending"))
        setLastSync(new Date())
      } catch (error) {
        console.error("Failed to sync pending data:", error)
      }
    }

    const loadPendingRequests = async () => {
      try {
        const requests = await offlineStorage.getEmergencyRequests()
        setPendingRequests(requests.filter((req) => req.status === "pending"))
      } catch (error) {
        console.error("Failed to load pending requests:", error)
      }
    }

    // Initial setup
    updateOnlineStatus()
    loadPendingRequests()

    // Event listeners
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Periodic sync when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        syncPendingData()
      }
    }, 30000) // Sync every 30 seconds when online

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      clearInterval(syncInterval)
    }
  }, [isOnline])

  const saveEmergencyRequest = async (requestData: Omit<OfflineEmergencyRequest, "id" | "timestamp" | "status">) => {
    try {
      const request: OfflineEmergencyRequest = {
        ...requestData,
        id: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        status: "pending",
      }

      await offlineStorage.saveEmergencyRequest(request)
      setPendingRequests((prev) => [...prev, request])

      if (isOnline) {
        // Try to sync immediately if online
        setTimeout(() => offlineStorage.syncPendingRequests(), 1000)
      }

      return { success: true, requestId: request.id }
    } catch (error) {
      console.error("Failed to save emergency request:", error)
      return { success: false, error: "Failed to save request" }
    }
  }

  const getOfflineData = async (key: string) => {
    return await offlineStorage.getData(key)
  }

  const saveOfflineData = async (key: string, data: any) => {
    await offlineStorage.saveData(key, data)
  }

  const getEmergencyContacts = async () => {
    return await offlineStorage.getEmergencyContacts()
  }

  const getOfflineDonors = async () => {
    return await offlineStorage.getDonors()
  }

  return {
    isOnline,
    pendingRequests: pendingRequests.length,
    lastSync,
    saveEmergencyRequest,
    getOfflineData,
    saveOfflineData,
    getEmergencyContacts,
    getOfflineDonors,
  }
}
