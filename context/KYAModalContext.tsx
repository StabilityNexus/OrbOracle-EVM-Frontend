'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface KYAModalContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const KYAModalContext = createContext<KYAModalContextValue | null>(null)

export function KYAModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <KYAModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </KYAModalContext.Provider>
  )
}

export function useKYAModal() {
  const context = useContext(KYAModalContext)
  if (!context) {
    throw new Error('useKYAModal must be used inside KYAModalProvider')
  }
  return context
}
