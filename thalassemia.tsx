"use client"

import { useState, useEffect } from "react"
import {
  Stethoscope,
  Users,
  Activity,
  CheckCircle,
  Heart,
  Phone,
  Calendar,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/interactive/animated-counter"
import { useToast } from "@/hooks/use-toast"

interface ThalassemiaPatient {
  id: number
  name: string
  age: number
  type: "Alpha" | "Beta"
  severity: "Minor" | "Major"
  lastTransfusion: string
  nextDue: string
  hospital: string
  status: "Stable" | "Critical" | "Monitoring"
}

export function ThalassemiaPage() {
  const [patients, setPatients] = useState<ThalassemiaPatient[]>([])
  const { toast } = useToast()

  const mockPatients: ThalassemiaPatient[] = [
    {
      id: 1,
      name: "Arjun Sharma",
      age: 12,
      type: "Beta",
      severity: "Major",
      lastTransfusion: "2024-01-10",
      nextDue: "2024-01-24",
      hospital: "Apollo Children's Hospital",
      status: "Stable",
    },
    {
      id: 2,
      name: "Kavya Patel",
      age: 8,
      type: "Alpha",
      severity: "Major",
      lastTransfusion: "2024-01-12",
      nextDue: "2024-01-26",
      hospital: "Max Super Speciality Hospital",
      status: "Monitoring",
    },
    {
      id: 3,
      name: "Rohit Kumar",
      age: 15,
      type: "Beta",
      severity: "Minor",
      lastTransfusion: "2023-12-15",
      nextDue: "2024-02-15",
      hospital: "Fortis Hospital",
      status: "Stable",
    },
  ]

  useEffect(() => {
    setPatients(mockPatients)
  }, [])

  const handleScheduleTransfusion = (patient: ThalassemiaPatient) => {
    toast({
      title: "Transfusion Scheduled",
      description: `Appointment scheduled for ${patient.name} at ${patient.hospital}`,
    })
  }

  const handleEmergencySupport = () => {
    toast({
      title: "Emergency Support Activated",
      description: "Connecting you with our 24/7 thalassemia support team",
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Thalassemia Support Center</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Comprehensive support and information for thalassemia patients and families with specialized care coordination
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Patients Supported", value: 156, icon: Users, color: "blue" },
          { label: "Regular Transfusions", value: 2400, icon: Activity, color: "green" },
          { label: "Partner Hospitals", value: 89, icon: Stethoscope, color: "purple" },
          { label: "Success Rate", value: 98, icon: CheckCircle, suffix: "%", color: "red" },
        ].map((stat, index) => (
          <Card key={index} className="glass-card text-center p-4 hover-lift">
            <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}-500`} />
            <div className="text-2xl font-bold text-foreground">
              <AnimatedCounter end={stat.value} suffix={stat.suffix || ""} />
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-600">
              <Info className="w-5 h-5 mr-2" />
              What is Thalassemia?
              <Badge className="ml-2 bg-purple-100 text-purple-600">Educational</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Thalassemia is an inherited blood disorder that affects the body's ability to produce hemoglobin and red
              blood cells. Patients with thalassemia have lower than normal amounts of hemoglobin or red blood cells in
              their bodies, leading to anemia and other complications.
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Types of Thalassemia:</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-foreground">Alpha Thalassemia</h5>
                  <p className="text-sm text-muted-foreground">Affects alpha globin chains production</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h5 className="font-medium text-foreground">Beta Thalassemia</h5>
                  <p className="text-sm text-muted-foreground">Affects beta globin chains production</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h5 className="font-medium text-foreground">Thalassemia Minor</h5>
                  <p className="text-sm text-muted-foreground">Mild form, often with no symptoms</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-foreground">Thalassemia Major</h5>
                  <p className="text-sm text-muted-foreground">Severe form, requires regular treatment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Stethoscope className="w-5 h-5 mr-2" />
              Treatment Options
              <Badge className="ml-2 bg-blue-100 text-blue-600">Medical Care</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-foreground flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  Blood Transfusions
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Regular transfusions every 2-4 weeks to maintain healthy hemoglobin levels and prevent complications
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium">Frequency: Every 14-28 days</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-foreground flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  Iron Chelation Therapy
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Removes excess iron from the body caused by frequent transfusions to prevent organ damage
                </p>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  Methods: Oral medication or subcutaneous injection
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-foreground flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                  Bone Marrow Transplant
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Potential cure for thalassemia with compatible donor, though carries significant risks
                </p>
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  Success Rate: 85-95% with matched sibling donor
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Management */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <Users className="w-5 h-5 mr-2" />
            Patient Management System
            <Badge className="ml-2 bg-green-100 text-green-600">Active Patients</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Card key={patient.id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{patient.name}</h4>
                    <Badge
                      className={
                        patient.status === "Stable"
                          ? "bg-green-500 text-white"
                          : patient.status === "Critical"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{patient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">
                        {patient.type} {patient.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Transfusion:</span>
                      <span className="font-medium">{new Date(patient.lastTransfusion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Due:</span>
                      <span className="font-medium text-blue-600">
                        {new Date(patient.nextDue).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-muted-foreground text-xs">Hospital:</span>
                      <p className="text-sm font-medium">{patient.hospital}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      onClick={() => handleScheduleTransfusion(patient)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Transfusion
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() =>
                        toast({
                          title: "Patient Records",
                          description: `Viewing detailed records for ${patient.name}`,
                        })
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Services */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <Heart className="w-5 h-5 mr-2" />
            Our Support Services
            <Badge className="ml-2 bg-orange-100 text-orange-600">24/7 Available</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold text-foreground mb-3">Patient Matching</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered matching with compatible blood donors for regular transfusions and emergency needs
              </p>
              <Button size="sm" variant="outline">
                Find Donors
              </Button>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <Phone className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold text-foreground mb-3">24/7 Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Round-the-clock medical support and emergency assistance for thalassemia patients
              </p>
              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleEmergencySupport}>
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold text-foreground mb-3">Medical Coordination</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coordination with hospitals and specialists for comprehensive thalassemia care
              </p>
              <Button size="sm" variant="outline">
                View Hospitals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="glass-card bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold mb-4">Thalassemia Emergency Support</h3>
          <p className="text-xl mb-6 opacity-90">
            Immediate assistance for thalassemia patients and families in crisis situations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3"
              onClick={handleEmergencySupport}
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency Hotline
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent text-lg px-8 py-3"
              onClick={() =>
                toast({
                  title: "Specialist Consultation",
                  description: "Connecting you with thalassemia specialists",
                })
              }
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Specialist Consult
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
