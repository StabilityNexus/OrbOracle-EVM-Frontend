"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle color theme"}
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle color theme"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait",
        className,
      )}
    >
      {mounted && (isDark
        ? <Sun aria-hidden="true" className="h-4 w-4" />
        : <Moon aria-hidden="true" className="h-4 w-4" />)}
    </button>
  )
}
