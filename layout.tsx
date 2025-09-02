import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import EyeProtection from "@/components/accessibility/eye-protection"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LifePulse Blood Bank - Professional Blood Banking Solution",
  description:
    "Professional blood banking platform connecting donors with recipients through secure, efficient matching and 24/7 emergency support services.",
  keywords: "blood bank, blood donation, thalassemia, emergency blood, donor matching",
  authors: [{ name: "LifePulse Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <EyeProtection />
        {children}
      </body>
    </html>
  )
}
