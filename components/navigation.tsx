"use client"

import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import PillNav from "./PillNav"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Explorer', href: '/explorer' },
    { label: 'Create', href: '/create' }
  ]

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      <PillNav
        logo="/logo.svg"
        logoAlt="OracleNet Logo"
        items={navItems}
        activeHref={pathname}
        ease="power3.easeOut"
        baseColor="oklch(0.7 0.18 270)"
        pillColor="oklch(0.05 0 0)"
        hoveredPillTextColor="oklch(0.95 0 0)"
        pillTextColor="oklch(0.95 0 0)"
      />
      <div className="ml-4">
        <ConnectButton />
      </div>
    </div>
  )
}
