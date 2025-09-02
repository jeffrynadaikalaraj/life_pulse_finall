"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Sun, Moon, Shield } from "lucide-react"

type EyeProtectionState = {
  enabled: boolean
  brightness: number // 0.5 - 1.1 (1 = normal)
  warmth: number // 0.0 - 0.6 (0 = off)
}

const STORAGE_KEYS = {
  enabled: "ep:enabled",
  brightness: "ep:brightness",
  warmth: "ep:warmth",
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function applyCssVars({ enabled, brightness, warmth }: EyeProtectionState) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty("--ep-brightness", enabled ? String(brightness) : "1")
  root.style.setProperty("--ep-warmth", enabled ? String(warmth) : "0")
}

function loadInitial(): EyeProtectionState {
  if (typeof window === "undefined") {
    return { enabled: false, brightness: 0.9, warmth: 0.15 }
  }
  try {
    const enabled = localStorage.getItem(STORAGE_KEYS.enabled)
    const brightness = localStorage.getItem(STORAGE_KEYS.brightness)
    const warmth = localStorage.getItem(STORAGE_KEYS.warmth)
    return {
      enabled: enabled ? enabled === "true" : false,
      brightness: brightness ? clamp(Number.parseFloat(brightness), 0.5, 1.1) : 0.9,
      warmth: warmth ? clamp(Number.parseFloat(warmth), 0, 0.6) : 0.15,
    }
  } catch {
    return { enabled: false, brightness: 0.9, warmth: 0.15 }
  }
}

export default function EyeProtection() {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<EyeProtectionState>(() => loadInitial())

  // Apply on mount and when values change
  React.useEffect(() => {
    applyCssVars(state)
    try {
      localStorage.setItem(STORAGE_KEYS.enabled, String(state.enabled))
      localStorage.setItem(STORAGE_KEYS.brightness, String(state.brightness))
      localStorage.setItem(STORAGE_KEYS.warmth, String(state.warmth))
    } catch {}
  }, [state])

  const setEnabled = (v: boolean) => setState((s) => ({ ...s, enabled: v }))
  const setBrightness = (v: number) => setState((s) => ({ ...s, brightness: clamp(v, 0.5, 1.1) }))
  const setWarmth = (v: number) => setState((s) => ({ ...s, warmth: clamp(v, 0, 0.6) }))

  const applyPreset = (preset: "off" | "low" | "medium" | "high") => {
    if (preset === "off") {
      setState({ enabled: false, brightness: 1, warmth: 0 })
      return
    }
    const next =
      preset === "low"
        ? { brightness: 0.9, warmth: 0.1 }
        : preset === "medium"
          ? { brightness: 0.8, warmth: 0.25 }
          : { brightness: 0.7, warmth: 0.4 }
    setState((s) => ({ ...s, enabled: true, ...next }))
  }

  return (
    <>
      {/* Warmth overlay */}
      <div aria-hidden="true" className="eye-protection-overlay pointer-events-none" />

      {/* Floating control */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="shadow-md" aria-label="Open eye protection controls">
              <Eye className="mr-2 h-4 w-4" />
              {"Eye protection"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {"Eye protection"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{"Enable"}</div>
                  <div className="text-sm text-muted-foreground">{"Dim screen and add warm tint"}</div>
                </div>
                <Switch checked={state.enabled} onCheckedChange={setEnabled} aria-label="Enable eye protection" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{"Brightness"}</div>
                  <div className="text-sm tabular-nums text-muted-foreground">
                    {Math.round(state.brightness * 100)}
                    {"%"}
                  </div>
                </div>
                <Slider
                  min={0.5}
                  max={1.1}
                  step={0.01}
                  value={[state.brightness]}
                  onValueChange={(v) => setBrightness(v[0] ?? 1)}
                  aria-label="Brightness"
                />
                <div className="text-xs text-muted-foreground">{"Lower is dimmer. 100% = normal brightness."}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    {"Warmth"}
                    <Moon className="h-4 w-4 opacity-60" />
                  </div>
                  <div className="text-sm tabular-nums text-muted-foreground">
                    {Math.round((state.warmth / 0.6) * 100)}
                    {"%"}
                  </div>
                </div>
                <Slider
                  min={0}
                  max={0.6}
                  step={0.01}
                  value={[state.warmth]}
                  onValueChange={(v) => setWarmth(v[0] ?? 0)}
                  aria-label="Warmth"
                />
                <div className="text-xs text-muted-foreground">
                  {"Increase to reduce blue light with a soft amber tint."}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => applyPreset("off")}>
                  {"Off"}
                </Button>
                <Button variant="outline" onClick={() => applyPreset("low")}>
                  {"Low"}
                </Button>
                <Button variant="outline" onClick={() => applyPreset("medium")}>
                  {"Medium"}
                </Button>
                <Button variant="outline" onClick={() => applyPreset("high")}>
                  {"High"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
