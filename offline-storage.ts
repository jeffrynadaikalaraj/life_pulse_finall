export interface OfflineEmergencyRequest {
  id: string
  timestamp: number
  bloodType: string
  location: string
  urgency: string
  patientName: string
  hospital: string
  contact: string
  unitsNeeded: string
  description: string
  status: "pending" | "synced" | "failed"
}

export interface OfflineDonor {
  id: number
  name: string
  bloodType: string
  location: string
  phone: string
  email: string
  status: string
  district: string
}

export interface OfflineData {
  emergencyRequests: OfflineEmergencyRequest[]
  donors: OfflineDonor[]
  emergencyContacts: any[]
  lastSync: number
}

class OfflineStorage {
  private dbName = "LifePulseDB"
  private version = 1

  async saveData(key: string, data: any): Promise<void> {
    try {
      const dataWithTimestamp = {
        data,
        timestamp: Date.now(),
        version: this.version,
      }
      localStorage.setItem(`lifepulse_${key}`, JSON.stringify(dataWithTimestamp))
    } catch (error) {
      console.error("Failed to save offline data:", error)
    }
  }

  async getData(key: string): Promise<any> {
    try {
      const stored = localStorage.getItem(`lifepulse_${key}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.data
      }
      return null
    } catch (error) {
      console.error("Failed to get offline data:", error)
      return null
    }
  }

  async saveEmergencyRequest(request: OfflineEmergencyRequest): Promise<void> {
    try {
      const existingRequests = (await this.getData("emergency_requests")) || []
      const updatedRequests = [...existingRequests, request]
      await this.saveData("emergency_requests", updatedRequests)
    } catch (error) {
      console.error("Failed to save emergency request:", error)
    }
  }

  async getEmergencyRequests(): Promise<OfflineEmergencyRequest[]> {
    try {
      return (await this.getData("emergency_requests")) || []
    } catch (error) {
      console.error("Failed to get emergency requests:", error)
      return []
    }
  }

  async saveDonors(donors: OfflineDonor[]): Promise<void> {
    await this.saveData("donors", donors)
  }

  async getDonors(): Promise<OfflineDonor[]> {
    return (await this.getData("donors")) || []
  }

  async saveEmergencyContacts(contacts: any[]): Promise<void> {
    await this.saveData("emergency_contacts", contacts)
  }

  async getEmergencyContacts(): Promise<any[]> {
    return (
      (await this.getData("emergency_contacts")) || [
        {
          name: "LifePulse Emergency Hotline",
          number: "1-800-LIFEPULSE",
          available: "24/7",
          type: "primary",
        },
        {
          name: "Local Emergency Services",
          number: "108",
          available: "24/7",
          type: "emergency",
        },
        {
          name: "Blood Bank Network",
          number: "+91 11 2659 7000",
          available: "24/7",
          type: "blood_bank",
        },
      ]
    )
  }

  async syncPendingRequests(): Promise<void> {
    try {
      const requests = await this.getEmergencyRequests()
      const pendingRequests = requests.filter((req) => req.status === "pending")

      for (const request of pendingRequests) {
        try {
          // Simulate API call - in real app, this would be actual API
          console.log("Syncing emergency request:", request.id)

          // Update status to synced
          const updatedRequests = requests.map((req) =>
            req.id === request.id ? { ...req, status: "synced" as const } : req,
          )
          await this.saveData("emergency_requests", updatedRequests)
        } catch (error) {
          console.error("Failed to sync request:", request.id, error)
        }
      }
    } catch (error) {
      console.error("Failed to sync pending requests:", error)
    }
  }

  async clearOldData(): Promise<void> {
    try {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const requests = await this.getEmergencyRequests()
      const recentRequests = requests.filter((req) => req.timestamp > oneWeekAgo)
      await this.saveData("emergency_requests", recentRequests)
    } catch (error) {
      console.error("Failed to clear old data:", error)
    }
  }

  async getStorageInfo(): Promise<{ used: number; available: number }> {
    try {
      let used = 0
      for (const key in localStorage) {
        if (key.startsWith("lifepulse_")) {
          used += localStorage[key].length
        }
      }

      // Estimate available space (5MB typical limit)
      const available = 5 * 1024 * 1024 - used

      return { used, available }
    } catch (error) {
      return { used: 0, available: 5 * 1024 * 1024 }
    }
  }
}

export const offlineStorage = new OfflineStorage()
