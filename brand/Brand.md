# Orb Oracle Branding Guidelines

This document details the branding assets, design principles, color palette, and typography configurations for the Orb Oracle protocol interface.

---

## 1. Logo System

The official logo of **Orb Oracle** is an interactive, real-time WebGL component designed to represent continuous oracle data feeds, cryptographic consensus, and decentralized network stability.

### A. Dynamic Shader Logomark (`components/OrbNavLogo.tsx`)

The standalone visual emblem is implemented as a lightweight WebGL shader component:
- **File**: [`components/OrbNavLogo.tsx`](../components/OrbNavLogo.tsx)
- **Engine**: OGL (minimal WebGL library running on a low-power profile)
- **Visual Mechanics**: A luminous sphere with fluid simplex 3D noise deformation and an orbiting specular highlight bead that accelerates upon user interaction/hover.
- **Shader Palette**:
  - **Electric Purple**: `#9C43FE` (`rgb(156, 67, 254)`)
  - **Vibrant Cyan-Blue**: `#4CC2E9` (`rgb(76, 194, 233)`)
  - **Royal Indigo**: `#101499` (`rgb(16, 20, 153)`)

### B. Navigation Brand Lockup (`components/navigation.tsx`)

The primary brand lockup displayed in the application header:
- **File**: [`components/navigation.tsx`](../components/navigation.tsx)
- **Structure**: Combines `<OrbNavLogo size={30} />` on the left with a dual-tone typographic mark on the right:
  - **`ORB`**: Bold white with an ambient purple glow (`drop-shadow-[0_0_12px_rgba(168,138,255,0.45)]`).
  - **`ORACLES`**: Light zinc-300 in tracked, uppercase Geist Sans (`tracking-[0.16em]`).

### C. Static Favicon & App Icon (`app/icon.svg`)

The static favicon and application icon:
- **File**: [`app/icon.svg`](../app/icon.svg)
- **Design**: A clean static vector rendering of the luminous cyan-and-purple orb with fluid gradients and a deep indigo core, optimized for browser tabs and bookmarks without moving elements.

---

## 2. Color Palette

The interface uses a modern dark-mode color palette built with CSS `oklch` variables in [`app/globals.css`](../app/globals.css) and mapped to Tailwind CSS. The primary UI backdrop and interactive orb gradient colors can be referenced in this [Coolors Palette](https://coolors.co/0d0d0d-141414-1f1f1f-333333-a3a3a3-8b5cf6-9c43fe-4cc2e9-101499).

### Base UI Colors

| Token Name | OKLCH Value | Approximate Hex | Role |
|---|---|---|---|
| `--background` | `oklch(0.05 0 0)` | `#0D0D0D` | Primary deep black background |
| `--foreground` | `oklch(0.95 0 0)` | `#F2F2F2` | Primary white text and high-contrast labels |
| `--card` | `oklch(0.08 0 0)` | `#141414` | Card surface and modular panel backgrounds |
| `--primary` | `oklch(0.7 0.18 270)` | `#8B5CF6` | Refined violet-purple for highlights, badges, and primary accents |
| `--secondary` | `oklch(0.12 0 0)` | `#1F1F1F` | Dark secondary containers and button backgrounds |
| `--muted` | `oklch(0.15 0 0)` | `#262626` | Inactive tabs and muted surfaces |
| `--muted-foreground` | `oklch(0.65 0 0)` | `#A3A3A3` | Secondary labels, descriptions, and placeholder text |
| `--accent` | `oklch(0.6 0.15 270)` | `#7C3AED` | Interactive hover glows and focused borders |
| `--border` | `oklch(0.2 0 0)` | `#333333` | Subtle 1px borders and dividers |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `#EF4444` | Error states and destructive confirmations |

### Logo & Accent Gradient Colors

| Color Name | Hex Code | Role |
|---|---|---|
| **Electric Purple** | `#9C43FE` | Primary energetic glow in WebGL orb shader |
| **Vibrant Cyan** | `#4CC2E9` | Dynamic edge specular light and cyan accents |
| **Royal Indigo** | `#101499` | Ambient core backdrop inside the sphere |

---

## 3. Typography

Typography is powered by Next.js font optimization using the **Geist** font family loaded in [`app/layout.tsx`](../app/layout.tsx).

### A. Primary UI Font: **Geist Sans**
- **Typeface**: Geist Sans (`geist/font/sans`)
- **Variable**: `var(--font-geist-sans)`
- **Tailwind Class**: `font-sans`
- **Usage**: Page headings, navigational items, descriptions, form labels, and interactive buttons.

### B. Monospace & Numeric Font: **Geist Mono**
- **Typeface**: Geist Mono (`geist/font/mono`)
- **Variable**: `var(--font-geist-mono)`
- **Tailwind Class**: `font-mono`
- **Usage**: Smart contract addresses, token symbols, price feed values, timestamps, lookback intervals, and transaction hashes.
