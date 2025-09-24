"use client"

import { usePathname } from "next/navigation"
import PillNav from "./PillNav"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Explorer', href: '/explorer' },
    { label: 'Create', href: '/create' }
  ]

  return (
    <PillNav
      logo="/logo.svg"
      logoAlt="OracleNet Logo"
      items={navItems}
      activeHref={pathname}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      ease="power3.easeOut"
      baseColor="oklch(0.7 0.18 270)"
      pillColor="oklch(0.05 0 0)"
      hoveredPillTextColor="oklch(0.95 0 0)"
      pillTextColor="oklch(0.95 0 0)"
    />
  )
}
