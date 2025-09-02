"use client"

interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotResponse {
  message: string
  suggestions?: string[]
  actions?: Array<{
    label: string
    action: string
    type: "emergency" | "info" | "navigation"
  }>
}

// Enhanced knowledge base for blood donation and LifePulse
const knowledgeBase = {
  bloodTypes: {
    "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
    "A-": { canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
    "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
    "B-": { canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
    "AB+": { canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    "AB-": { canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
    "O+": { canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
    "O-": { canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] },
  },

  eligibility: {
    age: { min: 18, max: 65 },
    weight: { min: 50 },
    frequency: {
      wholeBlood: "Every 56 days",
      platelets: "Every 7 days",
      plasma: "Every 28 days",
    },
  },

  emergencyContacts: [
    { name: "LifePulse Emergency", number: "1-800-LIFEPULSE", available: "24/7" },
    { name: "Blood Bank Hotline", number: "+91 1800-103-7788", available: "24/7" },
    { name: "Medical Emergency", number: "108", available: "24/7" },
  ],
}

export class LifePulseChatbot {
  private messages: ChatMessage[] = []
  private userLocation: { lat: number; lng: number } | null = null

  constructor() {
    this.requestLocationPermission()
  }

  private async requestLocationPermission() {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          })
        })

        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        console.log("User location obtained:", this.userLocation)
      } catch (error) {
        console.log("Location permission denied or unavailable")
      }
    }
  }

  public async sendMessage(message: string): Promise<ChatbotResponse> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      sender: "user",
      timestamp: new Date(),
    }

    this.messages.push(userMessage)

    const response = await this.generateResponse(message.toLowerCase())

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: response.message,
      sender: "bot",
      timestamp: new Date(),
    }

    this.messages.push(botMessage)

    return response
  }

  private async generateResponse(message: string): Promise<ChatbotResponse> {
    // Emergency keywords
    if (this.isEmergencyQuery(message)) {
      return this.handleEmergencyQuery(message)
    }

    // Blood type queries
    if (this.isBloodTypeQuery(message)) {
      return this.handleBloodTypeQuery(message)
    }

    // Eligibility queries
    if (this.isEligibilityQuery(message)) {
      return this.handleEligibilityQuery(message)
    }

    // Location-based queries
    if (this.isLocationQuery(message)) {
      return this.handleLocationQuery(message)
    }

    // Thalassemia queries
    if (this.isThalassemiaQuery(message)) {
      return this.handleThalassemiaQuery(message)
    }

    // Registration queries
    if (this.isRegistrationQuery(message)) {
      return this.handleRegistrationQuery(message)
    }

    // General LifePulse queries
    if (this.isLifePulseQuery(message)) {
      return this.handleLifePulseQuery(message)
    }

    // Default response
    return this.getDefaultResponse()
  }

  private isEmergencyQuery(message: string): boolean {
    const emergencyKeywords = ["emergency", "urgent", "critical", "need blood", "help", "asap", "immediately"]
    return emergencyKeywords.some((keyword) => message.includes(keyword))
  }

  private handleEmergencyQuery(message: string): ChatbotResponse {
    const locationInfo = this.userLocation
      ? `I can see you're located at coordinates ${this.userLocation.lat.toFixed(4)}, ${this.userLocation.lng.toFixed(4)}. `
      : "Please enable location services for faster emergency response. "

    return {
      message: `🚨 **EMERGENCY BLOOD REQUEST DETECTED** 🚨\n\n${locationInfo}Here's what you need to do immediately:\n\n1. **Call Emergency Hotline**: 1-800-LIFEPULSE (24/7)\n2. **Submit Emergency Request**: Use our emergency form\n3. **Contact Nearest Hospital**: We'll help you find the closest one\n\nDon't wait - every minute counts in emergencies!`,
      suggestions: ["Call Emergency Hotline", "Submit Emergency Request", "Find Nearest Hospital"],
      actions: [
        { label: "🚨 Emergency Form", action: "emergency", type: "emergency" },
        { label: "📞 Call Hotline", action: "call:1-800-LIFEPULSE", type: "emergency" },
        { label: "🏥 Find Hospital", action: "find-hospital", type: "emergency" },
      ],
    }
  }

  private isBloodTypeQuery(message: string): boolean {
    const bloodTypes = Object.keys(knowledgeBase.bloodTypes)
    return (
      bloodTypes.some((type) => message.includes(type.toLowerCase())) ||
      message.includes("blood type") ||
      message.includes("compatibility")
    )
  }

  private handleBloodTypeQuery(message: string): ChatbotResponse {
    // Extract blood type from message
    const bloodTypes = Object.keys(knowledgeBase.bloodTypes)
    const mentionedType = bloodTypes.find((type) => message.includes(type.toLowerCase()))

    if (mentionedType) {
      const typeInfo = knowledgeBase.bloodTypes[mentionedType as keyof typeof knowledgeBase.bloodTypes]
      return {
        message: `🩸 **Blood Type ${mentionedType} Information:**\n\n**Can donate to:** ${typeInfo.canDonateTo.join(", ")}\n**Can receive from:** ${typeInfo.canReceiveFrom.join(", ")}\n\n${mentionedType === "O-" ? "🌟 You are a **Universal Donor** - your blood can save anyone!" : ""}\n${mentionedType === "AB+" ? "🌟 You are a **Universal Recipient** - you can receive from any blood type!" : ""}\n\nWould you like to find donors or register as a donor?`,
        suggestions: ["Find Donors", "Register as Donor", "Emergency Request"],
        actions: [
          { label: "🔍 Find Donors", action: "find-blood", type: "navigation" },
          { label: "📝 Register", action: "register", type: "navigation" },
        ],
      }
    }

    return {
      message: `🩸 **Blood Type Compatibility Guide:**\n\n**Universal Donor:** O- (can donate to everyone)\n**Universal Recipient:** AB+ (can receive from everyone)\n\n**Type A:** Can donate to A, AB | Can receive from A, O\n**Type B:** Can donate to B, AB | Can receive from B, O\n**Type AB:** Can donate to AB only | Can receive from everyone\n**Type O:** Can donate to everyone | Can receive from O only\n\nWhich blood type would you like to know more about?`,
      suggestions: ["O-", "AB+", "A+", "B+"],
      actions: [{ label: "🔍 Find Blood", action: "find-blood", type: "navigation" }],
    }
  }

  private isEligibilityQuery(message: string): boolean {
    const eligibilityKeywords = ["eligible", "can i donate", "requirements", "qualify", "age", "weight"]
    return eligibilityKeywords.some((keyword) => message.includes(keyword))
  }

  private handleEligibilityQuery(message: string): ChatbotResponse {
    return {
      message: `✅ **Blood Donation Eligibility Requirements:**\n\n**Age:** ${knowledgeBase.eligibility.age.min}-${knowledgeBase.eligibility.age.max} years old\n**Weight:** Minimum ${knowledgeBase.eligibility.weight.min} kg\n**Health:** Good general health, no recent illness\n**Frequency:** \n• Whole Blood: ${knowledgeBase.eligibility.frequency.wholeBlood}\n• Platelets: ${knowledgeBase.eligibility.frequency.platelets}\n• Plasma: ${knowledgeBase.eligibility.frequency.plasma}\n\n**Before Donating:**\n• Get adequate sleep (6-8 hours)\n• Eat iron-rich foods\n• Stay hydrated\n• Avoid alcohol 24 hours before\n\nReady to register as a donor?`,
      suggestions: ["Register as Donor", "Find Donation Center", "More Requirements"],
      actions: [
        { label: "📝 Register Now", action: "register", type: "navigation" },
        { label: "🏥 Find Center", action: "find-hospital", type: "navigation" },
      ],
    }
  }

  private isLocationQuery(message: string): boolean {
    const locationKeywords = ["near me", "nearby", "location", "hospital", "center", "where"]
    return locationKeywords.some((keyword) => message.includes(keyword))
  }

  private handleLocationQuery(message: string): ChatbotResponse {
    if (this.userLocation) {
      return {
        message: `📍 **Your Location Detected:**\nLatitude: ${this.userLocation.lat.toFixed(6)}\nLongitude: ${this.userLocation.lng.toFixed(6)}\n\n🏥 **Finding nearby hospitals and blood banks...**\n\nBased on your location, I can help you find:\n• Nearest blood donation centers\n• Emergency hospitals\n• Available donors in your area\n• Blood banks with your required blood type\n\nWhat would you like to find?`,
        suggestions: ["Nearest Hospital", "Blood Banks", "Available Donors", "Emergency Centers"],
        actions: [
          { label: "🏥 Find Hospital", action: "find-hospital", type: "navigation" },
          { label: "🔍 Find Donors", action: "find-blood", type: "navigation" },
        ],
      }
    } else {
      return {
        message: `📍 **Location Services Needed**\n\nTo find nearby hospitals and blood banks, please:\n\n1. **Enable Location Services** in your browser\n2. **Allow LifePulse** to access your location\n3. **Refresh the page** if needed\n\nAlternatively, you can manually select your city from our supported locations:\n\n🏙️ **Available Cities:**\nMumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow\n\nWhich city are you in?`,
        suggestions: ["Mumbai", "Delhi", "Bangalore", "Chennai"],
        actions: [{ label: "📍 Enable Location", action: "enable-location", type: "info" }],
      }
    }
  }

  private isThalassemiaQuery(message: string): boolean {
    const thalassemiaKeywords = ["thalassemia", "thalassaemia", "regular transfusion", "genetic disorder"]
    return thalassemiaKeywords.some((keyword) => message.includes(keyword))
  }

  private handleThalassemiaQuery(message: string): ChatbotResponse {
    return {
      message: `🧬 **Thalassemia Support - LifePulse Cares**\n\n**What is Thalassemia?**\nA genetic blood disorder requiring regular blood transfusions\n\n**Our Thalassemia Services:**\n• **Regular Donor Matching** - Consistent blood supply\n• **Specialized Care Coordination** - Hospital partnerships\n• **Family Support Network** - Connect with other families\n• **Emergency Priority** - Fast-track urgent requests\n\n**Transfusion Schedule:**\n• **Alpha Thalassemia:** Every 3-4 weeks\n• **Beta Thalassemia Major:** Every 2-3 weeks\n• **Emergency Support:** 24/7 availability\n\nWe have ${this.getThalassemiaPatientCount()} registered thalassemia patients receiving regular support.`,
      suggestions: ["Register Patient", "Find Regular Donors", "Emergency Support", "Support Groups"],
      actions: [
        { label: "🏥 Thalassemia Care", action: "thalassemia", type: "navigation" },
        { label: "🚨 Emergency Help", action: "emergency", type: "emergency" },
      ],
    }
  }

  private isRegistrationQuery(message: string): boolean {
    const registrationKeywords = ["register", "sign up", "join", "become donor", "how to register"]
    return registrationKeywords.some((keyword) => message.includes(keyword))
  }

  private handleRegistrationQuery(message: string): ChatbotResponse {
    return {
      message: `📝 **Donor Registration - Join LifePulse Family**\n\n**Registration Process:**\n1. **Personal Information** - Name, age, contact details\n2. **Medical Details** - Blood type, weight, health status\n3. **Location** - Address and preferred donation centers\n4. **Verification** - Phone and email confirmation\n5. **Welcome Kit** - Donor card and guidelines\n\n**What You'll Get:**\n✅ **Donor ID Card** - Official recognition\n✅ **Health Checkups** - Free basic health screening\n✅ **Priority Support** - If you ever need blood\n✅ **Impact Updates** - See lives you've helped save\n\n**Ready to save lives?** Registration takes just 3 minutes!`,
      suggestions: ["Start Registration", "Check Eligibility", "Learn More"],
      actions: [
        { label: "📝 Register Now", action: "register", type: "navigation" },
        { label: "✅ Check Eligibility", action: "eligibility", type: "info" },
      ],
    }
  }

  private isLifePulseQuery(message: string): boolean {
    const lifepulseKeywords = ["lifepulse", "about", "features", "how it works", "what is"]
    return lifepulseKeywords.some((keyword) => message.includes(keyword))
  }

  private handleLifePulseQuery(message: string): ChatbotResponse {
    return {
      message: `❤️ **Welcome to LifePulse - Connecting Hearts, Saving Lives**\n\n**Our Mission:**\nConnecting blood donors with patients through technology, making blood donation accessible, efficient, and life-saving.\n\n**Key Features:**\n🔍 **Smart Matching** - AI-powered donor-patient matching\n📍 **GPS Location** - Find nearest hospitals and donors\n🚨 **Emergency Response** - 24/7 critical blood requests\n🏥 **Hospital Network** - 500+ partner hospitals\n📱 **Offline Support** - Works without internet\n🧬 **Thalassemia Care** - Specialized patient support\n\n**Impact So Far:**\n• 15,000+ registered donors\n• 3,200+ lives saved\n• 156 cities covered\n• 99.2% success rate\n\nHow can I help you today?`,
      suggestions: ["Register as Donor", "Find Blood", "Emergency Help", "Learn More"],
      actions: [
        { label: "📝 Join as Donor", action: "register", type: "navigation" },
        { label: "🔍 Find Blood", action: "find-blood", type: "navigation" },
        { label: "🚨 Emergency", action: "emergency", type: "emergency" },
      ],
    }
  }

  private getDefaultResponse(): ChatbotResponse {
    return {
      message: `👋 **Hello! I'm your LifePulse Assistant**\n\nI can help you with:\n\n🩸 **Blood Donation Information**\n• Eligibility requirements\n• Blood type compatibility\n• Donation process and preparation\n\n🚨 **Emergency Support**\n• Urgent blood requests\n• Emergency contacts\n• Hospital locations\n\n📍 **Location Services**\n• Find nearby donors\n• Locate blood banks\n• Hospital directions\n\n🧬 **Thalassemia Support**\n• Regular transfusion coordination\n• Specialized care information\n\nWhat would you like to know about?`,
      suggestions: ["Blood Donation Info", "Emergency Help", "Find Donors", "Register"],
      actions: [
        { label: "🔍 Find Blood", action: "find-blood", type: "navigation" },
        { label: "📝 Register", action: "register", type: "navigation" },
        { label: "🚨 Emergency", action: "emergency", type: "emergency" },
      ],
    }
  }

  private getThalassemiaPatientCount(): number {
    // This would typically come from your database
    return 247
  }

  public getMessages(): ChatMessage[] {
    return this.messages
  }

  public getUserLocation(): { lat: number; lng: number } | null {
    return this.userLocation
  }

  public async updateLocation(): Promise<boolean> {
    try {
      await this.requestLocationPermission()
      return this.userLocation !== null
    } catch (error) {
      return false
    }
  }
}

export const chatbot = new LifePulseChatbot()
