"use server"

// Enhanced simulated database with more donors
const donors = [
  {
    id: 1,
    name: "Rajesh Kumar",
    bloodType: "O+",
    location: "Mumbai",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    status: "Available",
    lastDonation: "3 months ago",
    donations: 12,
    age: 28,
    weight: 70,
    district: "Mumbai",
    avatar: "/placeholder.svg?height=100&width=100&text=RK",
  },
  {
    id: 2,
    name: "Priya Sharma",
    bloodType: "A+",
    location: "Delhi",
    phone: "+91 98765 43211",
    email: "priya@example.com",
    status: "Available",
    lastDonation: "4 months ago",
    donations: 8,
    age: 25,
    weight: 55,
    district: "Delhi",
    avatar: "/placeholder.svg?height=100&width=100&text=PS",
  },
  {
    id: 3,
    name: "Amit Patel",
    bloodType: "B+",
    location: "Bangalore",
    phone: "+91 98765 43212",
    email: "amit@example.com",
    status: "Unavailable",
    lastDonation: "2 months ago",
    donations: 15,
    age: 32,
    weight: 75,
    district: "Bangalore",
    avatar: "/placeholder.svg?height=100&width=100&text=AP",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    bloodType: "AB+",
    location: "Hyderabad",
    phone: "+91 98765 43213",
    email: "sneha@example.com",
    status: "Available",
    lastDonation: "5 months ago",
    donations: 6,
    age: 29,
    weight: 60,
    district: "Hyderabad",
    avatar: "/placeholder.svg?height=100&width=100&text=SR",
  },
  {
    id: 5,
    name: "Vikram Singh",
    bloodType: "O-",
    location: "Chennai",
    phone: "+91 98765 43214",
    email: "vikram@example.com",
    status: "Available",
    lastDonation: "4 months ago",
    donations: 20,
    age: 35,
    weight: 80,
    district: "Chennai",
    avatar: "/placeholder.svg?height=100&width=100&text=VS",
  },
  {
    id: 6,
    name: "Anita Gupta",
    bloodType: "A-",
    location: "Kolkata",
    phone: "+91 98765 43215",
    email: "anita@example.com",
    status: "Available",
    lastDonation: "3 months ago",
    donations: 9,
    age: 27,
    weight: 58,
    district: "Kolkata",
    avatar: "/placeholder.svg?height=100&width=100&text=AG",
  },
  {
    id: 7,
    name: "Rohit Mehta",
    bloodType: "B-",
    location: "Pune",
    phone: "+91 98765 43216",
    email: "rohit@example.com",
    status: "Available",
    lastDonation: "6 months ago",
    donations: 14,
    age: 31,
    weight: 72,
    district: "Pune",
    avatar: "/placeholder.svg?height=100&width=100&text=RM",
  },
  {
    id: 8,
    name: "Kavya Nair",
    bloodType: "AB-",
    location: "Kochi",
    phone: "+91 98765 43217",
    email: "kavya@example.com",
    status: "Available",
    lastDonation: "4 months ago",
    donations: 7,
    age: 26,
    weight: 54,
    district: "Kochi",
    avatar: "/placeholder.svg?height=100&width=100&text=KN",
  },
  {
    id: 9,
    name: "Arjun Rao",
    bloodType: "O+",
    location: "Bangalore",
    phone: "+91 98765 43218",
    email: "arjun@example.com",
    status: "Available",
    lastDonation: "2 months ago",
    donations: 18,
    age: 33,
    weight: 78,
    district: "Bangalore",
    avatar: "/placeholder.svg?height=100&width=100&text=AR",
  },
  {
    id: 10,
    name: "Deepika Shah",
    bloodType: "A+",
    location: "Ahmedabad",
    phone: "+91 98765 43219",
    email: "deepika@example.com",
    status: "Available",
    lastDonation: "5 months ago",
    donations: 11,
    age: 29,
    weight: 62,
    district: "Ahmedabad",
    avatar: "/placeholder.svg?height=100&width=100&text=DS",
  },
  {
    id: 11,
    name: "Manish Jain",
    bloodType: "B+",
    location: "Jaipur",
    phone: "+91 98765 43220",
    email: "manish@example.com",
    status: "Available",
    lastDonation: "3 months ago",
    donations: 13,
    age: 30,
    weight: 75,
    district: "Jaipur",
    avatar: "/placeholder.svg?height=100&width=100&text=MJ",
  },
  {
    id: 12,
    name: "Pooja Agarwal",
    bloodType: "O-",
    location: "Lucknow",
    phone: "+91 98765 43221",
    email: "pooja@example.com",
    status: "Available",
    lastDonation: "4 months ago",
    donations: 16,
    age: 28,
    weight: 56,
    district: "Lucknow",
    avatar: "/placeholder.svg?height=100&width=100&text=PA",
  },
  {
    id: 13,
    name: "Sanjay Kumar",
    bloodType: "AB+",
    location: "Patna",
    phone: "+91 98765 43222",
    email: "sanjay@example.com",
    status: "Available",
    lastDonation: "6 months ago",
    donations: 10,
    age: 34,
    weight: 80,
    district: "Patna",
    avatar: "/placeholder.svg?height=100&width=100&text=SK",
  },
  {
    id: 14,
    name: "Ritu Singh",
    bloodType: "A-",
    location: "Kanpur",
    phone: "+91 98765 43223",
    email: "ritu@example.com",
    status: "Available",
    lastDonation: "3 months ago",
    donations: 8,
    age: 26,
    weight: 53,
    district: "Kanpur",
    avatar: "/placeholder.svg?height=100&width=100&text=RS",
  },
  {
    id: 15,
    name: "Anil Verma",
    bloodType: "B-",
    location: "Indore",
    phone: "+91 98765 43224",
    email: "anil@example.com",
    status: "Available",
    lastDonation: "5 months ago",
    donations: 12,
    age: 32,
    weight: 74,
    district: "Indore",
    avatar: "/placeholder.svg?height=100&width=100&text=AV",
  },
  {
    id: 16,
    name: "Meera Iyer",
    bloodType: "O+",
    location: "Chennai",
    phone: "+91 98765 43225",
    email: "meera@example.com",
    status: "Available",
    lastDonation: "2 months ago",
    donations: 19,
    age: 31,
    weight: 59,
    district: "Chennai",
    avatar: "/placeholder.svg?height=100&width=100&text=MI",
  },
  {
    id: 17,
    name: "Rahul Desai",
    bloodType: "AB-",
    location: "Surat",
    phone: "+91 98765 43226",
    email: "rahul@example.com",
    status: "Available",
    lastDonation: "4 months ago",
    donations: 9,
    age: 27,
    weight: 71,
    district: "Surat",
    avatar: "/placeholder.svg?height=100&width=100&text=RD",
  },
  {
    id: 18,
    name: "Sunita Pandey",
    bloodType: "A+",
    location: "Varanasi",
    phone: "+91 98765 43227",
    email: "sunita@example.com",
    status: "Available",
    lastDonation: "3 months ago",
    donations: 14,
    age: 29,
    weight: 57,
    district: "Varanasi",
    avatar: "/placeholder.svg?height=100&width=100&text=SP",
  },
  {
    id: 19,
    name: "Kiran Malhotra",
    bloodType: "B+",
    location: "Ludhiana",
    phone: "+91 98765 43228",
    email: "kiran@example.com",
    status: "Available",
    lastDonation: "5 months ago",
    donations: 11,
    age: 30,
    weight: 68,
    district: "Ludhiana",
    avatar: "/placeholder.svg?height=100&width=100&text=KM",
  },
  {
    id: 20,
    name: "Vishal Chopra",
    bloodType: "O-",
    location: "Amritsar",
    phone: "+91 98765 43229",
    email: "vishal@example.com",
    status: "Available",
    lastDonation: "6 months ago",
    donations: 17,
    age: 33,
    weight: 76,
    district: "Amritsar",
    avatar: "/placeholder.svg?height=100&width=100&text=VC",
  },
]

const bloodRequests = [
  {
    id: "REQ-001",
    patient: "John Doe",
    bloodType: "O+",
    hospital: "Apollo Hospital, Mumbai",
    urgency: "Critical",
    unitsNeeded: 3,
    timePosted: "2 hours ago",
    status: "Pending",
    contact: "+91 98765 43210",
    description: "Emergency surgery required",
  },
  {
    id: "REQ-002",
    patient: "Sarah Wilson",
    bloodType: "A-",
    hospital: "Fortis Hospital, Delhi",
    urgency: "High",
    unitsNeeded: 2,
    timePosted: "4 hours ago",
    status: "In Progress",
    contact: "+91 98765 43211",
    description: "Cancer treatment",
  },
  {
    id: "REQ-003",
    patient: "Michael Brown",
    bloodType: "B+",
    hospital: "Max Hospital, Bangalore",
    urgency: "Medium",
    unitsNeeded: 1,
    timePosted: "6 hours ago",
    status: "Fulfilled",
    contact: "+91 98765 43212",
    description: "Routine surgery",
  },
  {
    id: "REQ-004",
    patient: "Lisa Anderson",
    bloodType: "AB-",
    hospital: "AIIMS, Delhi",
    urgency: "Critical",
    unitsNeeded: 4,
    timePosted: "1 hour ago",
    status: "Pending",
    contact: "+91 98765 43213",
    description: "Thalassemia patient - regular transfusion",
  },
  {
    id: "REQ-005",
    patient: "David Kumar",
    bloodType: "O-",
    hospital: "Manipal Hospital, Bangalore",
    urgency: "High",
    unitsNeeded: 2,
    timePosted: "3 hours ago",
    status: "In Progress",
    contact: "+91 98765 43214",
    description: "Accident victim",
  },
]

// Thalassemia patients database
const thalassemiaPatients = [
  {
    id: "THAL-001",
    name: "Arya Sharma",
    age: 12,
    bloodType: "B+",
    location: "Mumbai",
    hospital: "Tata Memorial Hospital",
    transfusionFrequency: "Every 3 weeks",
    lastTransfusion: "1 week ago",
    nextDue: "2 weeks",
    contact: "+91 98765 44001",
    guardian: "Mrs. Rekha Sharma",
    status: "Active Treatment",
  },
  {
    id: "THAL-002",
    name: "Rohan Patel",
    age: 8,
    bloodType: "A+",
    location: "Ahmedabad",
    hospital: "Civil Hospital",
    transfusionFrequency: "Every 4 weeks",
    lastTransfusion: "2 weeks ago",
    nextDue: "2 weeks",
    contact: "+91 98765 44002",
    guardian: "Mr. Suresh Patel",
    status: "Active Treatment",
  },
  {
    id: "THAL-003",
    name: "Priya Reddy",
    age: 15,
    bloodType: "O+",
    location: "Hyderabad",
    hospital: "Nims Hospital",
    transfusionFrequency: "Every 3 weeks",
    lastTransfusion: "5 days ago",
    nextDue: "2.5 weeks",
    contact: "+91 98765 44003",
    guardian: "Mrs. Lakshmi Reddy",
    status: "Active Treatment",
  },
]

export async function registerDonor(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const donorData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    age: formData.get("age") as string,
    gender: formData.get("gender") as string,
    bloodGroup: formData.get("bloodGroup") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    district: formData.get("district") as string,
    address: formData.get("address") as string,
    weight: formData.get("weight") as string,
    lastDonation: formData.get("lastDonation") as string,
    medicalConditions: formData.get("medicalConditions") as string,
  }

  if (!donorData.firstName || !donorData.lastName || !donorData.bloodGroup || !donorData.phone) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  const newDonor = {
    id: donors.length + 1,
    name: `${donorData.firstName} ${donorData.lastName}`,
    bloodType: donorData.bloodGroup,
    location: donorData.district,
    phone: donorData.phone,
    email: donorData.email,
    status: "Available",
    lastDonation: donorData.lastDonation || "Never",
    donations: 0,
    age: Number.parseInt(donorData.age || "0"),
    weight: Number.parseInt(donorData.weight || "0"),
    district: donorData.district,
    avatar: `/placeholder.svg?height=100&width=100&text=${donorData.firstName[0]}${donorData.lastName[0]}`,
  }

  donors.push(newDonor)

  return {
    success: true,
    message: `Welcome to LifePulse, ${donorData.firstName}! Your registration is complete. You can now help save lives through blood donation.`,
    donorId: newDonor.id,
  }
}

export async function searchDonors(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const bloodGroup = formData.get("bloodGroup") as string
  const district = formData.get("district") as string

  if (!bloodGroup || !district) {
    return {
      success: false,
      message: "Please select both blood group and district",
    }
  }

  const matchingDonors = donors.filter(
    (donor) =>
      donor.bloodType === bloodGroup &&
      donor.district.toLowerCase() === district.toLowerCase() &&
      donor.status === "Available",
  )

  return {
    success: true,
    message: `Found ${matchingDonors.length} available donors`,
    donors: matchingDonors,
  }
}

export async function createBloodRequest(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const requestData = {
    patientName: formData.get("patientName") as string,
    bloodType: formData.get("bloodType") as string,
    hospital: formData.get("hospital") as string,
    urgency: formData.get("urgency") as string,
    unitsNeeded: formData.get("unitsNeeded") as string,
    contact: formData.get("contact") as string,
    description: formData.get("description") as string,
  }

  const newRequest = {
    id: `REQ-${String(bloodRequests.length + 1).padStart(3, "0")}`,
    patient: requestData.patientName,
    bloodType: requestData.bloodType,
    hospital: requestData.hospital,
    urgency: requestData.urgency,
    unitsNeeded: Number.parseInt(requestData.unitsNeeded || "1"),
    timePosted: "Just now",
    status: "Pending",
    contact: requestData.contact,
    description: requestData.description,
  }

  bloodRequests.push(newRequest)

  return {
    success: true,
    message: `Blood request ${newRequest.id} created successfully. We're matching you with available donors.`,
    requestId: newRequest.id,
  }
}

export async function adminLogin(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (username === "admin" && password === "lifepulse2024") {
    return {
      success: true,
      message: "Login successful! Welcome to LifePulse Admin Dashboard.",
      redirectTo: "/dashboard",
    }
  }

  return {
    success: false,
    message: "Invalid credentials. Please check your username and password.",
  }
}

export async function contactDonor(donorId: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const donor = donors.find((d) => d.id === donorId)
  if (!donor) {
    return {
      success: false,
      message: "Donor not found",
    }
  }

  return {
    success: true,
    message: `Contact initiated with ${donor.name}. They will be notified of your request.`,
    donor: donor,
  }
}

export async function sendEmergencyAlert(bloodType: string, location: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const compatibleDonors = donors.filter(
    (donor) => donor.bloodType === bloodType && donor.location === location && donor.status === "Available",
  )

  return {
    success: true,
    message: `Emergency alert sent to ${compatibleDonors.length} compatible donors in ${location}`,
    donorsAlerted: compatibleDonors.length,
  }
}

export async function scheduleAppointment(donorId: number, date: string, time: string) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const donor = donors.find((d) => d.id === donorId)
  if (!donor) {
    return {
      success: false,
      message: "Donor not found",
    }
  }

  return {
    success: true,
    message: `Appointment scheduled with ${donor.name} on ${date} at ${time}`,
    appointmentId: `APT-${Date.now()}`,
  }
}

export async function getDonors() {
  return donors
}

export async function getBloodRequests() {
  return bloodRequests
}

export async function getThalassemiaPatients() {
  return thalassemiaPatients
}

export async function searchThalassemiaPatients(bloodType?: string, location?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredPatients = thalassemiaPatients

  if (bloodType) {
    filteredPatients = filteredPatients.filter((patient) => patient.bloodType === bloodType)
  }

  if (location) {
    filteredPatients = filteredPatients.filter((patient) =>
      patient.location.toLowerCase().includes(location.toLowerCase()),
    )
  }

  return {
    success: true,
    patients: filteredPatients,
    message: `Found ${filteredPatients.length} thalassemia patients`,
  }
}
