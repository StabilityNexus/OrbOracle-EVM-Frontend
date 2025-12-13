


import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { WalletProvider } from '@/providers/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Orb Oracle | Stability Nexus',
  description: 'Orb Oracle EVM Frontend by Stability Nexus',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
    <body className={inter.className}>
  <WalletProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  </WalletProvider>

  <footer
    style={{
      textAlign: 'center',
      padding: '12px',
      fontsize: '14px',
      opacity: 0.8,
    }}
  >
    © 2025 Stability Nexus. All rights reserved.
  </footer>
</body>

    </html>
  )
}