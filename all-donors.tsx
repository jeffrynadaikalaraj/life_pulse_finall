"use client"

import { useState, useEffect } from "react"
import { Users, Activity, MapPin, Heart, Phone, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedCounter } from "@/components/interactive/animated-counter"
import { useToast } from "@/hooks/use-toast"

interface Donor {
  id: number
  name: string
  bloodType: string
  location: string
  age: number
  donations: number
  status: string
  phone: string
  lastDonation: string
}

export function AllDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBloodType, setFilterBloodType] = useState("All Blood Types")
  const [filterStatus, setFilterStatus] = useState("All Status")
  const { toast } = useToast()

  const mockDonors: Donor[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      bloodType: "O+",
      location: "Mumbai",
      age: 32,
      donations: 12,
      status: "Available",
      phone: "+91 98765 43210",
      lastDonation: "2 months ago",
    },
    {
      id: 2,
      name: "Priya Sharma",
      bloodType: "A+",
      location: "Delhi",
      age: 28,
      donations: 8,
      status: "Available",
      phone: "+91 87654 32109",
      lastDonation: "3 months ago",
    },
    {
      id: 3,
      name: "Amit Patel",
      bloodType: "B+",
      location: "Bangalore",
      age: 35,
      donations: 15,
      status: "Not Available",
      phone: "+91 76543 21098",
      lastDonation: "1 month ago",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      bloodType: "AB+",
      location: "Hyderabad",
      age: 29,
      donations: 6,
      status: "Available",
      phone: "+91 65432 10987",
      lastDonation: "4 months ago",
    },
    {
      id: 5,
      name: "Vikram Singh",
      bloodType: "O-",
      location: "Chennai",
      age: 31,
      donations: 20,
      status: "Available",
      phone: "+91 54321 09876",
      lastDonation: "1 month ago",
    },
    {
      id: 6,
      name: "Anita Gupta",
      bloodType: "A-",
      location: "Kolkata",
      age: 27,
      donations: 9,
      status: "Available",
      phone: "+91 43210 98765",
      lastDonation: "2 months ago",
    },
  ]

  useEffect(() => {
    setDonors(mockDonors)
    setFilteredDonors(mockDonors)
  }, [])

  useEffect(() => {
    let filtered = donors

    if (searchTerm) {
      filtered = filtered.filter(
        (donor) =>
          donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterBloodType !== "All Blood Types") {
      filtered = filtered.filter((donor) => donor.bloodType === filterBloodType)
    }

    if (filterStatus !== "All Status") {
      filtered = filtered.filter((donor) => donor.status === filterStatus)
    }

    setFilteredDonors(filtered)
  }, [searchTerm, filterBloodType, filterStatus, donors])

  const handleContactDonor = (donor: Donor) => {
    toast({
      title: "📞 Contacting Donor",
      description: `Calling ${donor.name} at ${donor.phone}. Please wait...`,
    })
  }

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Our Hero Donors</h1>
        <p className="text-xl text-muted-foreground">
          Meet our amazing community of {donors.length}+ verified blood donors
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Donors", value: donors.length, icon: Users, color: "blue" },
          { label: "Active This Month", value: Math.floor(donors.length * 0.7), icon: Activity, color: "green" },
          { label: "Cities Covered", value: 156, icon: MapPin, color: "purple" },
          { label: "Lives Saved", value: 8541, icon: Heart, color: "red" },
        ].map((stat, index) => (
          <Card key={index} className="glass-card text-center p-4 hover-lift">
            <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-foreground">
              <AnimatedCounter end={stat.value} />
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search donors by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterBloodType} onValueChange={setFilterBloodType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Blood Types">All Blood Types</SelectItem>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="glass-card hover-lift group">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                    {donor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-foreground">{donor.name}</h3>
                <p className="text-sm text-muted-foreground">{donor.location}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blood Type:</span>
                  <Badge className="bg-red-500 text-white">{donor.bloodType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Age:</span>
                  <span className="text-sm">{donor.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Donations:</span>
                  <span className="text-sm font-medium">{donor.donations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    className={donor.status === "Available" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                  >
                    {donor.status}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => handleContactDonor(donor)}
                disabled={donor.status !== "Available"}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Donors Found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters to find more donors.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
