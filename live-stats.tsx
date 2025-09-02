"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "./animated-counter"
import { Heart, Users, MapPin, Activity, TrendingUp, Clock } from "lucide-react"

interface LiveStat {
  label: string
  value: number
  icon: React.ComponentType<any>
  color: string
  change: string
  suffix?: string
}

export function LiveStats() {
  const [stats] = useState<LiveStat[]>([
    {
      label: "Active Donors",
      value: 2847,
      icon: Users,
      color: "text-blue-600",
      change: "+12%",
      suffix: "",
    },
    {
      label: "Lives Saved",
      value: 8541,
      icon: Heart,
      color: "text-red-600",
      change: "+8%",
      suffix: "",
    },
    {
      label: "Cities Covered",
      value: 156,
      icon: MapPin,
      color: "text-green-600",
      change: "+5%",
      suffix: "",
    },
    {
      label: "Success Rate",
      value: 98.2,
      icon: TrendingUp,
      color: "text-purple-600",
      change: "+2.1%",
      suffix: "%",
    },
    {
      label: "Response Time",
      value: 4.3,
      icon: Clock,
      color: "text-orange-600",
      change: "-0.8",
      suffix: " min",
    },
    {
      label: "Active Requests",
      value: 23,
      icon: Activity,
      color: "text-indigo-600",
      change: "+3",
      suffix: "",
    },
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
