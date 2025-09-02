"use client"

import { useState, useEffect } from "react"
import { Heart, Phone, Clock, MapPin, User, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface BloodRequest {
  id: number
  patient: string
  bloodType: string
  hospital: string
  location: string
  unitsNeeded: number
  urgency: "Critical" | "High" | "Medium"
  status: "Pending" | "In Progress" | "Fulfilled"
  timePosted: string
  contact: string
  description?: string
}

export function BloodRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const mockRequests: BloodRequest[] = [
    {
      id: 1,
      patient: "Ramesh Gupta",
      bloodType: "O+",
      hospital: "Apollo Hospital",
      location: "Mumbai",
      unitsNeeded: 2,
      urgency: "Critical",
      status: "Pending",
      timePosted: "2 hours ago",
      contact: "+91 98765 43210",
      description: "Emergency surgery required",
    },
    {
      id: 2,
      patient: "Sunita Sharma",
      bloodType: "A+",
      hospital: "Max Hospital",
      location: "Delhi",
      unitsNeeded: 1,
      urgency: "High",
      status: "In Progress",
      timePosted: "4 hours ago",
      contact: "+91 87654 32109",
      description: "Planned surgery",
    },
    {
      id: 3,
      patient: "Kiran Patel",
      bloodType: "B-",
      hospital: "Fortis Hospital",
      location: "Bangalore",
      unitsNeeded: 3,
      urgency: "Medium",
      status: "Fulfilled",
      timePosted: "1 day ago",
      contact: "+91 76543 21098",
      description: "Thalassemia patient",
    },
  ]

  useEffect(() => {
    setRequests(mockRequests)
  }, [])

  const handleCreateRequest = async (formData: FormData) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newRequest: BloodRequest = {
        id: requests.length + 1,
        patient: formData.get("patientName") as string,
        bloodType: formData.get("bloodType") as string,
        hospital: formData.get("hospital") as string,
        location: formData.get("location") as string,
        unitsNeeded: Number.parseInt(formData.get("unitsNeeded") as string),
        urgency: formData.get("urgency") as "Critical" | "High" | "Medium",
        status: "Pending",
        timePosted: "Just now",
        contact: formData.get("contact") as string,
        description: formData.get("description") as string,
      }

      setRequests([newRequest, ...requests])
      setIsSubmitting(false)

      toast({
        title: "✅ Blood Request Created",
        description: "Your request has been posted and donors are being notified.",
      })
    }, 2000)
  }

  const handleRespondToRequest = (request: BloodRequest) => {
    toast({
      title: "Response Sent",
      description: `Your response to ${request.patient}'s request has been sent to ${request.hospital}`,
    })
  }

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Blood Requests</h1>
        <p className="text-xl text-muted-foreground">
          Active blood requests from hospitals and patients across the network
        </p>
      </div>

      {/* Create Request Form */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Heart className="w-5 h-5 mr-2" />
            Create Blood Request
            <Badge className="ml-2 bg-red-100 text-red-600">Emergency Service</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreateRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input name="patientName" placeholder="Enter patient name" className="form-bright" required />
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type Required *</Label>
                <Select name="bloodType" required>
                  <SelectTrigger className="form-bright">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-bright">
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
                <Label htmlFor="hospital">Hospital Name *</Label>
                <Input name="hospital" placeholder="Enter hospital name" className="form-bright" required />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input name="location" placeholder="City/District" className="form-bright" required />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select name="urgency" required>
                  <SelectTrigger className="form-bright">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-bright">
                    <SelectItem value="Critical">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="High">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitsNeeded">Units Needed *</Label>
                <Input
                  name="unitsNeeded"
                  type="number"
                  placeholder="Number of units"
                  className="form-bright"
                  required
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input name="contact" placeholder="+91 98765 43210" className="form-bright" required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                name="description"
                placeholder="Any additional information about the requirement"
                className="form-bright"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Request...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Create Blood Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Requests */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">Active Requests</h2>
          <Badge className="bg-blue-500 text-white">{requests.length} total requests</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={
                      request.urgency === "Critical"
                        ? "bg-red-500 text-white animate-pulse"
                        : request.urgency === "High"
                          ? "bg-orange-500 text-white"
                          : "bg-yellow-500 text-white"
                    }
                  >
                    {request.urgency}
                  </Badge>
                  <Badge
                    className={
                      request.status === "Pending"
                        ? "bg-gray-500 text-white"
                        : request.status === "In Progress"
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{request.patient}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blood Type:</span>
                    <Badge className="bg-red-500 text-white">{request.bloodType}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Units:</span>
                    <span className="font-medium">{request.unitsNeeded}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {request.hospital}, {request.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted:</span>
                    <span className="text-sm">{request.timePosted}</span>
                  </div>
                  {request.description && (
                    <div className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {request.description}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={() => handleRespondToRequest(request)}
                    disabled={request.status === "Fulfilled"}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {request.status === "Fulfilled" ? "Request Fulfilled" : "Respond to Request"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() =>
                      toast({
                        title: "Contact Information",
                        description: `Hospital contact: ${request.contact}`,
                      })
                    }
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Hospital
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
