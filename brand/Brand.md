# Orb Oracle Branding Guidelines

This document details the branding assets, design principles, color palette, and typography configurations for the Orb Oracle protocol interface.

---

## 1. Logo System (Status: In Progress)

The official logo system for **Orb Oracle** is currently under design and discussion. To ensure frontend development remains unblocked, these assets will be finalized and added to the `brand/` directory in the upcoming weeks:

* **Logomark (`logomark.svg`):** A custom vector icon representing orbital rings and oracle data feeds (in progress).
* **Logotype (`logotype.svg`):** A custom text wordmark matching the primary typography (in progress).
* **Combined Logo (`logo-combined.svg`):** The primary brand configuration combining the mark and the logotype (in progress).

---

## 2. Color Palette

The interface uses a modern, dark-mode-first color palette designed to feel premium, clean, and glassmorphic. The colors are defined in the Tailwind CSS configuration using `oklch` variables, and the primary brand scheme can be referenced in this [Coolors Palette](https://coolors.co/252525-ffffff-fbfbfb-454545-b5b5b5-4f46e5).

| Color Name | OKLCH / Hex Code | Tailwind Mapping | Role |
|---|---|---|---|
| **Obsidian Black** | `oklch(0.145 0 0)` / `#252525` | `background` / `card` | Primary dark-mode backdrop and container background |
| **Pure White** | `oklch(1 0 0)` / `#FFFFFF` | `foreground` | Primary text and button overlays (Light mode bg) |
| **Contrast Off-White** | `oklch(0.985 0 0)` / `#FBFBFB` | `primary` | Active button text, highlighted text headers |
| **Charcoal Gray** | `oklch(0.269 0 0)` / `#454545` | `border` / `muted` | Card borders, secondary outlines, and input outlines |
| **Muted Gray** | `oklch(0.708 0 0)` / `#B5B5B5` | `muted-foreground` | Secondary labels, descriptions, and placeholder text |
| **Neon Indigo** | `--color-accent` / `#4F46E5` | `accent` | Button hover states, interactive glows, and status badges |

---

## 3. Typography

The project specifies two core typefaces from the **Geist** font family, optimized for developer-focused interfaces, transaction outputs, and clear numeric alignments.

### A. Primary UI Font: **Geist Sans**

A highly readable, clean, modern sans-serif font designed for application layouts, headers, and description text.
* **Setup:** Loaded dynamically via the standard Next.js `geist` package.
* **Tailwind Mapping:** `var(--font-geist-sans)`

### B. Secondary UI Font: **Geist Mono**

A matching monospace typeface used for addresses, price values, transaction hashes, timestamps, and numbers where monospace alignment is critical.
* **Setup:** Loaded dynamically via the standard Next.js `geist` package.
* **Tailwind Mapping:** `var(--font-geist-mono)`
