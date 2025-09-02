"use client"

import CryptoJS from "crypto-js"

// Security configuration
export const SECURITY_CONFIG = {
  ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lifepulse-security-key-2024",
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 3,
  PASSWORD_MIN_LENGTH: 8,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
}

// Encryption utilities
export class SecurityUtils {
  static encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, SECURITY_CONFIG.ENCRYPTION_KEY).toString()
    } catch (error) {
      console.error("Encryption failed:", error)
      return text
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECURITY_CONFIG.ENCRYPTION_KEY)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error("Decryption failed:", error)
      return encryptedText
    }
  }

  static hashPassword(password: string): string {
    return CryptoJS.PBKDF2(password, "lifepulse-salt", {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString()
  }

  static generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }

  static validateInput(input: string): boolean {
    // Basic XSS and SQL injection prevention
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /(union|select|insert|delete|drop|create|alter|exec|execute)/gi,
      /['"`;]/g,
    ]

    return !dangerousPatterns.some((pattern) => pattern.test(input))
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/['"`;]/g, "")
      .trim()
  }
}

// Threat detection
export class ThreatDetector {
  private static attempts: Map<string, number> = new Map()
  private static lastAttempt: Map<string, number> = new Map()

  static detectBruteForce(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || 0
    const lastAttempt = this.lastAttempt.get(identifier) || 0

    // Reset attempts if window expired
    if (now - lastAttempt > SECURITY_CONFIG.RATE_LIMIT_WINDOW) {
      this.attempts.set(identifier, 0)
      return false
    }

    // Check if exceeded max attempts
    if (attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return true
    }

    return false
  }

  static recordFailedAttempt(identifier: string): void {
    const attempts = this.attempts.get(identifier) || 0
    this.attempts.set(identifier, attempts + 1)
    this.lastAttempt.set(identifier, Date.now())
  }

  static resetAttempts(identifier: string): void {
    this.attempts.delete(identifier)
    this.lastAttempt.delete(identifier)
  }
}

// Session management
export class SessionManager {
  private static sessions: Map<
    string,
    {
      userId: string
      createdAt: number
      lastActivity: number
      ipAddress?: string
    }
  > = new Map()

  static createSession(userId: string, ipAddress?: string): string {
    const sessionId = SecurityUtils.generateSecureToken()
    const now = Date.now()

    this.sessions.set(sessionId, {
      userId,
      createdAt: now,
      lastActivity: now,
      ipAddress,
    })

    return sessionId
  }

  static validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const now = Date.now()

    // Check if session expired
    if (now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId)
      return false
    }

    // Update last activity
    session.lastActivity = now
    return true
  }

  static destroySession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  static getActiveSessionsCount(): number {
    return this.sessions.size
  }
}

// Audit logging
export class AuditLogger {
  private static logs: Array<{
    id: string
    timestamp: number
    event: string
    userId?: string
    ipAddress?: string
    details: any
    severity: "low" | "medium" | "high" | "critical"
  }> = []

  static log(
    event: string,
    details: any,
    severity: "low" | "medium" | "high" | "critical" = "low",
    userId?: string,
    ipAddress?: string,
  ): void {
    const logEntry = {
      id: SecurityUtils.generateSecureToken(),
      timestamp: Date.now(),
      event,
      userId,
      ipAddress,
      details,
      severity,
    }

    this.logs.push(logEntry)

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift()
    }

    // Log to console for development
    console.log(`[AUDIT] ${severity.toUpperCase()}: ${event}`, details)
  }

  static getLogs(limit = 100): typeof this.logs {
    return this.logs.slice(-limit).reverse()
  }

  static getLogsByUser(userId: string): typeof this.logs {
    return this.logs.filter((log) => log.userId === userId)
  }

  static getLogsBySeverity(severity: string): typeof this.logs {
    return this.logs.filter((log) => log.severity === severity)
  }
}
