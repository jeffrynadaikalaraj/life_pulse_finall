"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "@/hooks/use-location"
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Droplets,
  Search,
  Route,
  Star,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  distance: number
  rating: number
  isOpen24h: boolean
  bloodBank: boolean
  availableBloodTypes: string[]
  capacity: {
    [key: string]: number
  }
  coordinates: {
    lat: number
    lng: number
  }
  emergencyServices: boolean
  specialties: string[]
}

const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    phone: "+1-555-0123",
    distance: 2.3,
    rating: 4.8,
    isOpen24h: true,
    bloodBank: true,
    availableBloodTypes: ["A+", "A-", "B+", "O+", "O-"],
    capacity: { "A+": 85, "A-": 45, "B+": 70, "O+": 90, "O-": 30 },
    coordinates: { lat: 40.7128, lng: -74.006 },
    emergencyServices: true,
    specialties: ["Emergency", "Cardiology", "Trauma"],
  },
  {
    id: "2",
    name: "St. Mary's Medical Center",
    address: "456 Oak Avenue, Midtown",
    phone: "+1-555-0456",
    distance: 4.1,
    rating: 4.6,
    isOpen24h: true,
    bloodBank: true,
    availableBloodTypes: ["A+", "B+", "B-", "AB+", "O+"],
    capacity: { "A+": 60, "B+": 80, "B-": 25, "AB+": 40, "O+": 75 },
    coordinates: { lat: 40.7589, lng: -73.9851 },
    emergencyServices: true,
    specialties: ["Emergency", "Pediatrics", "Oncology"],
  },
  {
    id: "3",
    name: "Regional Blood Center",
    address: "789 Health Drive, Uptown",
    phone: "+1-555-0789",
    distance: 6.8,
    rating: 4.9,
    isOpen24h: false,
    bloodBank: true,
    availableBloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    capacity: { "A+": 95, "A-": 70, "B+": 85, "B-": 55, "AB+": 60, "AB-": 35, "O+": 100, "O-": 80 },
    coordinates: { lat: 40.7831, lng: -73.9712 },
    emergencyServices: false,
    specialties: ["Blood Banking", "Transfusion Medicine"],
  },
  {
    id: "4",
    name: "Emergency Care Hospital",
    address: "321 Rescue Road, Eastside",
    phone: "+1-555-0321",
    distance: 8.2,
    rating: 4.4,
    isOpen24h: true,
    bloodBank: true,
    availableBloodTypes: ["A+", "O+", "O-"],
    capacity: { "A+": 40, "O+": 65, "O-": 20 },
    coordinates: { lat: 40.7282, lng: -73.7949 },
    emergencyServices: true,
    specialties: ["Emergency", "Trauma", "Critical Care"],
  },
  {
    id: "5",
    name: "Community Health Center",
    address: "654 Community Lane, Westside",
    phone: "+1-555-0654",
    distance: 12.5,
    rating: 4.2,
    isOpen24h: false,
    bloodBank: true,
    availableBloodTypes: ["A+", "B+", "AB+", "O+"],
    capacity: { "A+": 50, "B+": 45, "AB+": 30, "O+": 55 },
    coordinates: { lat: 40.6892, lng: -74.0445 },
    emergencyServices: false,
    specialties: ["Family Medicine", "Internal Medicine"],
  },
]

export function HospitalMapPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals)
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>(mockHospitals)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBloodType, setSelectedBloodType] = useState("A+") // Updated default value
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)
  const [show24hOnly, setShow24hOnly] = useState(false)
  const { toast } = useToast()
  const { location, requestLocation } = useLocation()

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  useEffect(() => {
    let filtered = hospitals

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by blood type
    if (selectedBloodType) {
      filtered = filtered.filter((hospital) => hospital.availableBloodTypes.includes(selectedBloodType))
    }

    // Filter by emergency services
    if (showEmergencyOnly) {
      filtered = filtered.filter((hospital) => hospital.emergencyServices)
    }

    // Filter by 24h availability
    if (show24hOnly) {
      filtered = filtered.filter((hospital) => hospital.isOpen24h)
    }

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance)

    setFilteredHospitals(filtered)
  }, [hospitals, searchQuery, selectedBloodType, showEmergencyOnly, show24hOnly])

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
    toast({
      title: "Calling Hospital",
      description: `Dialing ${phone}`,
    })
  }

  const handleNavigate = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&travelmode=driving`
    window.open(url, "_blank")
    toast({
      title: "Opening Navigation",
      description: `Navigating to ${hospital.name}`,
    })
  }

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600 bg-green-100 dark:bg-green-900/30"
    if (percentage >= 40) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
    return "text-red-600 bg-red-100 dark:bg-red-900/30"
  }

  const getEstimatedTime = (distance: number) => {
    // Rough estimation: 30 km/h average speed in city
    const timeInHours = distance / 30
    const timeInMinutes = Math.round(timeInHours * 60)
    return timeInMinutes
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-600 text-white mb-6">
          <MapPin className="w-5 h-5 mr-2" />
          <span className="font-semibold">Hospital Locator</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Find Nearby Hospitals</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          GPS-powered hospital search with real-time blood bank availability and navigation assistance.
        </p>
      </div>

      {/* Current Location */}
      {location && (
        <Card className="border-2 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Location</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white font-semibold">GPS Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-600" />
            Search & Filter Hospitals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hospitals by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Type</label>
              <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Any blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Services</label>
              <Button
                variant={showEmergencyOnly ? "default" : "outline"}
                onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                className="w-full border-2"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {showEmergencyOnly ? "Emergency Only" : "All Hospitals"}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Availability</label>
              <Button
                variant={show24hOnly ? "default" : "outline"}
                onClick={() => setShow24hOnly(!show24hOnly)}
                className="w-full border-2"
              >
                <Clock className="w-4 h-4 mr-2" />
                {show24hOnly ? "24/7 Only" : "All Hours"}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Results</label>
              <div className="flex items-center justify-center h-10 px-4 bg-gray-100 dark:bg-gray-800 rounded-md border-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {filteredHospitals.length} hospitals found
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital List */}
      <div className="space-y-4">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Hospital Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{hospital.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hospital.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">
                          {hospital.rating}
                        </span>
                      </div>
                      {hospital.isOpen24h && <Badge className="bg-green-600 text-white font-semibold">24/7</Badge>}
                      {hospital.emergencyServices && (
                        <Badge className="bg-red-600 text-white font-semibold">Emergency</Badge>
                      )}
                    </div>
                  </div>

                  {/* Distance and Time */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Route className="w-4 h-4 mr-1" />
                      <span>{hospital.distance} km away</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>~{getEstimatedTime(hospital.distance)} min drive</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Blood Bank Info */}
                  {hospital.bloodBank && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                        <Droplets className="w-4 h-4 mr-1 text-red-600" />
                        Blood Bank Availability
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {hospital.availableBloodTypes.map((bloodType) => (
                          <div key={bloodType} className="text-center">
                            <div
                              className={`px-2 py-1 rounded text-xs font-semibold ${getCapacityColor(hospital.capacity[bloodType] || 0)}`}
                            >
                              {bloodType}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{hospital.capacity[bloodType] || 0}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 lg:ml-6">
                  <Button
                    onClick={() => handleCall(hospital.phone)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hospital
                  </Button>
                  <Button
                    onClick={() => handleNavigate(hospital)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(hospital.name)}`, "_blank")
                    }
                    className="border-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    More Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredHospitals.length === 0 && (
        <Card className="border-2 border-gray-200 dark:border-gray-600">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Hospitals Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedBloodType("A+") // Updated default value
                setShowEmergencyOnly(false)
                setShow24hOnly(false)
              }}
              variant="outline"
              className="border-2"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      <Card className="border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Emergency Services</h3>
                <p className="text-sm text-red-700 dark:text-red-200">
                  For life-threatening emergencies, call 911 immediately
                </p>
              </div>
            </div>
            <Button onClick={() => window.open("tel:911", "_self")} className="bg-red-600 hover:bg-red-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call 911
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
