"use client"

import { useState } from "react"
import { Search, MapPin, Heart, Phone, Zap, Target, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const topDistricts = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"]

interface Donor {
  id: number
  name: string
  bloodType: string
  location: string
  phone: string
  donations: number
  lastDonation: string
  status: string
}

export function FindBloodPage() {
  const [searchResults, setSearchResults] = useState<Donor[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const { toast } = useToast()

  const mockDonors: Donor[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      bloodType: "O+",
      location: "Mumbai Central",
      phone: "+91 98765 43210",
      donations: 12,
      lastDonation: "2 months ago",
      status: "Available",
    },
    {
      id: 2,
      name: "Priya Sharma",
      bloodType: "A+",
      location: "Delhi NCR",
      phone: "+91 87654 32109",
      donations: 8,
      lastDonation: "3 months ago",
      status: "Available",
    },
    {
      id: 3,
      name: "Amit Patel",
      bloodType: "B+",
      location: "Bangalore",
      phone: "+91 76543 21098",
      donations: 15,
      lastDonation: "1 month ago",
      status: "Available",
    },
  ]

  const handleSearch = async () => {
    if (!selectedBloodType || !selectedDistrict) {
      toast({
        title: "Missing Information",
        description: "Please select both blood type and location to search.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const filteredDonors = mockDonors.filter(
        (donor) =>
          donor.bloodType === selectedBloodType ||
          donor.location.toLowerCase().includes(selectedDistrict.toLowerCase()),
      )
      setSearchResults(filteredDonors)
      setIsSearching(false)

      toast({
        title: "Search Complete",
        description: `Found ${filteredDonors.length} compatible donors in your area.`,
      })
    }, 2000)
  }

  const handleContactDonor = (donor: Donor) => {
    toast({
      title: "📞 Contacting Donor",
      description: `Connecting you with ${donor.name}. Please wait...`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <Search className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-blue-500 font-medium">AI-Powered Blood Search</span>
          <Zap className="w-4 h-4 text-blue-500 ml-2" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4">Find Blood Donors</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced AI matching system connects you with compatible donors in real-time across 156+ cities
        </p>
      </div>

      {/* Search Form */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Target className="w-5 h-5 mr-2" />
            Smart Blood Search
            <Badge className="ml-2 bg-blue-100 text-blue-600">AI Enhanced</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bloodGroup" className="text-foreground flex items-center">
                  Blood Group Required *<Badge className="ml-2 bg-red-100 text-red-600">Critical</Badge>
                </Label>
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="form-bright">
                    <SelectValue placeholder="Select blood group needed" />
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
                <Label htmlFor="district" className="text-foreground">
                  Location/District *
                </Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="form-bright">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-bright">
                    {topDistricts.map((district) => (
                      <SelectItem key={district} value={district.toLowerCase()}>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {district}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching Donors...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Compatible Donors
                  <Zap className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Available Donors</h2>
            <Badge className="bg-green-500 text-white">{searchResults.length} donors found</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((donor) => (
              <Card key={donor.id} className="glass-card hover-lift group">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {donor.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{donor.name}</h3>
                      <p className="text-sm text-muted-foreground">{donor.location}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Blood Type:</span>
                      <Badge className="bg-red-500 text-white">{donor.bloodType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Donations:</span>
                      <span className="text-sm font-medium">{donor.donations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Donation:</span>
                      <span className="text-sm">{donor.lastDonation}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleContactDonor(donor)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Donor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Section */}
      <Card className="glass-card bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold mb-4">Emergency Blood Required?</h3>
          <p className="text-xl mb-6 opacity-90">
            Our 24/7 emergency service connects you instantly with available donors
          </p>
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() =>
              toast({
                title: "🚨 Emergency Alert Sent",
                description: "All compatible donors in your area have been notified",
              })
            }
          >
            <Phone className="w-5 h-5 mr-2" />
            Emergency Alert
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
