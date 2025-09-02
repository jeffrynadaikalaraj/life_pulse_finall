"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  MapPin,
  Droplets,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  AlertCircle,
} from "lucide-react"

interface DonorFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string

  // Address Information
  address: string
  city: string
  state: string
  zipCode: string

  // Medical Information
  bloodType: string
  weight: string
  height: string
  medicalConditions: string
  medications: string
  lastDonation: string

  // Emergency Contact
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
}

const initialFormData: DonorFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  bloodType: "",
  weight: "",
  height: "",
  medicalConditions: "",
  medications: "",
  lastDonation: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
}

export function RegisterDonorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<DonorFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof DonorFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth &&
          formData.gender
        )
      case 2:
        return !!(
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode &&
          formData.bloodType &&
          formData.weight
        )
      case 3:
        return !!(formData.emergencyName && formData.emergencyPhone && formData.emergencyRelation)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Registration Successful!",
        description: "Welcome to LifePulse! Your donor profile has been created.",
      })

      // Reset form
      setFormData(initialFormData)
      setCurrentStep(1)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h3>
        <p className="text-gray-600 dark:text-gray-400">Let's start with your basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Address & Medical Info</h3>
        <p className="text-gray-600 dark:text-gray-400">Your location and health information</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter your street address"
            className="border-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City"
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="State"
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="ZIP Code"
              className="border-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type *</Label>
            <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select blood type" />
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
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              placeholder="Weight in kg"
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="Height in cm"
              className="border-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={formData.medicalConditions}
              onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
              placeholder="List any medical conditions (optional)"
              className="border-2"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={formData.medications}
              onChange={(e) => handleInputChange("medications", e.target.value)}
              placeholder="List current medications (optional)"
              className="border-2"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastDonation">Last Blood Donation Date</Label>
          <Input
            id="lastDonation"
            type="date"
            value={formData.lastDonation}
            onChange={(e) => handleInputChange("lastDonation", e.target.value)}
            className="border-2"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Emergency Contact</h3>
        <p className="text-gray-600 dark:text-gray-400">Someone we can contact in case of emergency</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
          <Input
            id="emergencyName"
            value={formData.emergencyName}
            onChange={(e) => handleInputChange("emergencyName", e.target.value)}
            placeholder="Full name of emergency contact"
            className="border-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
              placeholder="Phone number"
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">Relationship *</Label>
            <Select
              value={formData.emergencyRelation}
              onValueChange={(value) => handleInputChange("emergencyRelation", value)}
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Important Information
          </h4>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>• You must be at least 18 years old and weigh at least 50kg to donate blood.</p>
            <p>• You should be in good health and feeling well on the day of donation.</p>
            <p>• There should be at least 56 days between whole blood donations.</p>
            <p>• Your information will be kept confidential and used only for blood donation purposes.</p>
            <p>• You can update or delete your information at any time by contacting us.</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-600 text-white mb-6">
          <Heart className="w-5 h-5 mr-2" />
          <span className="font-semibold">Donor Registration</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Join Our Life-Saving Community</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Register as a blood donor and help save lives in your community. Every donation can save up to 3 lives.
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${step <= currentStep ? "text-red-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step <= currentStep ? "bg-red-600 border-red-600 text-white" : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {step === 1 && "Personal"}
                  {step === 2 && "Medical"}
                  {step === 3 && "Emergency"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="border-2">
        <CardContent className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-2 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Complete Registration
              </>
            )}
          </Button>
        )}
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          {
            icon: Heart,
            title: "Save Lives",
            description: "Each donation can save up to 3 lives",
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/30",
          },
          {
            icon: Shield,
            title: "Health Checkup",
            description: "Free health screening with every donation",
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            icon: Droplets,
            title: "Community Impact",
            description: "Help patients in your local community",
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/30",
          },
        ].map((benefit, index) => (
          <Card key={index} className="text-center border-2">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${benefit.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className={`text-lg font-bold ${benefit.color} mb-2`}>{benefit.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
