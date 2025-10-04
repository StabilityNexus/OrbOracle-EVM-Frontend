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
    <>
      {/* Navigation in the center */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
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
          className="!relative !top-0 !left-0 !w-auto"
        />
      </div>
      
      {/* Connect button on the right */}
      <div className="fixed top-4 right-6 z-50">
        <ConnectButton />
      </div>
    </>
  )
}
