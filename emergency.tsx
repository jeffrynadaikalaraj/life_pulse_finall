"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Phone,
  AlertTriangle,
  Clock,
  MapPin,
  Heart,
  Truck,
  Zap,
  Activity,
  Users,
  CheckCircle,
  Timer,
  Wifi,
  WifiOff,
  Save,
  FolderSyncIcon as Sync,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOffline } from "@/hooks/use-offline"
import { sendEmergencyAlert } from "@/lib/actions"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const urgencyLevels = ["Critical", "High", "Medium"]
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]

export function EmergencyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([])
  const [emergencyData, setEmergencyData] = useState({
    bloodType: "",
    location: "",
    urgency: "",
    patientName: "",
    hospital: "",
    contact: "",
    unitsNeeded: "",
    description: "",
  })

  const { toast } = useToast()
  const { isOnline, saveEmergencyRequest, getEmergencyContacts, pendingRequests } = useOffline()

  useEffect(() => {
    const loadEmergencyContacts = async () => {
      const contacts = await getEmergencyContacts()
      setEmergencyContacts(contacts)
    }
    loadEmergencyContacts()
  }, [getEmergencyContacts])

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isOnline) {
        // Online: Try to send immediately
        const result = await sendEmergencyAlert(emergencyData.bloodType, emergencyData.location)

        if (result.success) {
          toast({
            title: "🚨 Emergency Alert Sent!",
            description: `Alert sent to ${result.donorsAlerted} compatible donors in ${emergencyData.location}`,
          })
        }
      } else {
        // Offline: Save for later sync
        const result = await saveEmergencyRequest({
          bloodType: emergencyData.bloodType,
          location: emergencyData.location,
          urgency: emergencyData.urgency,
          patientName: emergencyData.patientName,
          hospital: emergencyData.hospital,
          contact: emergencyData.contact,
          unitsNeeded: emergencyData.unitsNeeded,
          description: emergencyData.description,
        })

        if (result.success) {
          toast({
            title: "📱 Emergency Request Saved!",
            description:
              "Your request is saved offline and will be sent when connection is restored. Call emergency contacts immediately!",
          })
        }
      }

      // Reset form
      setEmergencyData({
        bloodType: "",
        location: "",
        urgency: "",
        patientName: "",
        hospital: "",
        contact: "",
        unitsNeeded: "",
        description: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process emergency request. Please call emergency hotline immediately.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEmergencyData((prev) => ({ ...prev, [field]: value }))
  }

  const callEmergencyNumber = (number: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Offline Status Alert */}
      {!isOnline && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <WifiOff className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <div className="flex items-center justify-between">
              <div>
                <strong>Offline Mode Active</strong> - Emergency features available without internet.
                {pendingRequests > 0 && (
                  <div className="mt-1 text-sm">
                    {pendingRequests} emergency requests saved and will sync when online.
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => callEmergencyNumber("1-800-LIFEPULSE")}
                className="ml-4"
              >
                <Phone className="w-4 h-4 mr-1" />
                Call Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-500 font-semibold">24/7 Emergency Blood Services</span>
          <Truck className="w-5 h-5 text-red-500 ml-2" />
          {!isOnline && <WifiOff className="w-4 h-4 text-red-500 ml-2" />}
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4">Emergency Blood Request</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {isOnline
            ? "Critical blood needs? Our emergency response system connects you with available donors in under 2 minutes."
            : "No internet? No problem! Submit emergency requests offline - they'll be sent when connection is restored."}
        </p>
      </div>

      {/* Emergency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Response Time", value: "< 2 min", icon: Timer, color: "text-red-500" },
          { label: "Success Rate", value: "99.2%", icon: CheckCircle, color: "text-green-500" },
          { label: "Available Donors", value: "2,847", icon: Users, color: "text-blue-500" },
          { label: "Cities Covered", value: "156", icon: MapPin, color: "text-purple-500" },
        ].map((stat, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Contacts - Always Available */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Emergency Contacts</h3>
            <p className="text-xl opacity-90">Available 24/7 - Call immediately for urgent blood needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-2">{contact.name}</h4>
                  <Button
                    variant="secondary"
                    className="bg-white text-red-600 hover:bg-gray-100 w-full mb-2"
                    onClick={() => callEmergencyNumber(contact.number)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {contact.number}
                  </Button>
                  <div className="text-sm opacity-75">{contact.available}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              <span>Instant Response</span>
            </div>
            <div className="flex items-center">
              {isOnline ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
              <span>{isOnline ? "Online" : "Offline Ready"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
            Submit Emergency Blood Request
            {!isOnline && (
              <div className="ml-auto flex items-center text-sm text-muted-foreground">
                <Save className="w-4 h-4 mr-1" />
                Offline Mode
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmergencySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bloodType" className="text-foreground">
                  Blood Type Required *
                </Label>
                <Select
                  value={emergencyData.bloodType}
                  onValueChange={(value) => handleInputChange("bloodType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2 text-red-500" />
                          {type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-foreground">
                  Location *
                </Label>
                <Select value={emergencyData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency" className="text-foreground">
                  Urgency Level *
                </Label>
                <Select value={emergencyData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center">
                          <AlertTriangle
                            className={`w-4 h-4 mr-2 ${
                              level === "Critical"
                                ? "text-red-500"
                                : level === "High"
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }`}
                          />
                          {level}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unitsNeeded" className="text-foreground">
                  Units Needed *
                </Label>
                <Input
                  id="unitsNeeded"
                  type="number"
                  min="1"
                  max="10"
                  value={emergencyData.unitsNeeded}
                  onChange={(e) => handleInputChange("unitsNeeded", e.target.value)}
                  placeholder="Number of units"
                  required
                />
              </div>

              <div>
                <Label htmlFor="patientName" className="text-foreground">
                  Patient Name *
                </Label>
                <Input
                  id="patientName"
                  value={emergencyData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  placeholder="Patient's full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hospital" className="text-foreground">
                  Hospital/Medical Center *
                </Label>
                <Input
                  id="hospital"
                  value={emergencyData.hospital}
                  onChange={(e) => handleInputChange("hospital", e.target.value)}
                  placeholder="Hospital name and location"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact" className="text-foreground">
                  Emergency Contact *
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  value={emergencyData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground">
                Medical Details/Description
              </Label>
              <Textarea
                id="description"
                value={emergencyData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the medical situation..."
                rows={3}
              />
            </div>

            <Alert
              className={`${!isOnline ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"}`}
            >
              <AlertTriangle className={`h-4 w-4 ${!isOnline ? "text-blue-500" : "text-yellow-500"}`} />
              <AlertDescription
                className={`${!isOnline ? "text-blue-700 dark:text-blue-300" : "text-yellow-700 dark:text-yellow-300"}`}
              >
                {!isOnline ? (
                  <>
                    <strong>Offline Mode:</strong> Your emergency request will be saved locally and automatically sent
                    when internet connection is restored. For immediate assistance, please call the emergency hotline
                    above.
                  </>
                ) : (
                  "This is an emergency request system. Please ensure all information is accurate. Our team will verify details before connecting donors."
                )}
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-xl"
            >
              {isSubmitting ? (
                <>
                  <Activity className="w-6 h-6 mr-3 animate-spin" />
                  {isOnline ? "Sending Emergency Alert..." : "Saving Request..."}
                </>
              ) : (
                <>
                  {isOnline ? (
                    <>
                      <AlertTriangle className="w-6 h-6 mr-3" />
                      Send Emergency Alert
                      <Zap className="w-5 h-5 ml-3" />
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3" />
                      Save Emergency Request
                      <Sync className="w-5 h-5 ml-3" />
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* How It Works - Updated for Offline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How Our Emergency System Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                {isOnline ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : (
                  <Save className="w-8 h-8 text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold">1. Submit Request</h3>
              <p className="text-muted-foreground">
                {isOnline
                  ? "Fill out the emergency form with patient details. Our system validates and processes immediately."
                  : "Submit your emergency request offline. It's saved securely and will be sent when connection returns."}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                {isOnline ? <Users className="w-8 h-8 text-blue-500" /> : <Phone className="w-8 h-8 text-blue-500" />}
              </div>
              <h3 className="text-lg font-semibold">2. {isOnline ? "Instant Matching" : "Call Emergency"}</h3>
              <p className="text-muted-foreground">
                {isOnline
                  ? "Our AI system immediately identifies compatible donors in your area and sends emergency notifications."
                  : "While offline, call our 24/7 emergency hotline immediately. All contact numbers work without internet."}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                {isOnline ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Sync className="w-8 h-8 text-green-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold">3. {isOnline ? "Quick Response" : "Auto Sync"}</h3>
              <p className="text-muted-foreground">
                {isOnline
                  ? "Donors respond within minutes. We coordinate the donation process and keep you updated throughout."
                  : "When connection returns, your saved requests automatically sync and donors are notified immediately."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
