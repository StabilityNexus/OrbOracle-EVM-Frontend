

import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import '../src/shaders/threeui.css'
import { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { WalletProvider } from '@/providers/WalletProvider'
import { Navigation } from '@/components/navigation'
import ClientFooter from '@/components/ClientFooter'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'OrbOracle | Decentralized Oracle Network for DeFi',
  description: 'OrbOracle is a decentralized oracle network providing reliable price feeds and data for DeFi applications. Create custom oracles, manage voting weights, and access real-time blockchain data across multiple networks.',
  keywords: [
    'OrbOracle',
    'decentralized oracle',
    'DeFi',
    'blockchain oracle',
    'price feeds',
    'data oracle',
    'Ethereum',
    'Polygon',
    'BSC',
    'Base',
    'Stability Nexus',
    'The Stable Order',
    'smart contracts',
    'Web3',
    'cryptocurrency',
  ],
  authors: [{ name: 'The Stable Order', url: 'https://stability.nexus' }],
  creator: 'The Stable Order',
  publisher: 'The Stable Order',
  applicationName: 'OrbOracle',
  category: 'Finance',
  metadataBase: new URL('https://orboracle.stability.nexus'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OrbOracle | Decentralized Oracle Network',
    description: 'OrbOracle is a decentralized oracle network providing reliable price feeds and data for DeFi applications. Create custom oracles and access real-time blockchain data.',
    url: 'https://orboracle.stability.nexus',
    siteName: 'OrbOracle',
    images: [
      {
        url: 'https://orboracle.stability.nexus/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OrbOracle - Decentralized Oracle Network',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OrbOracle | Decentralized Oracle Network',
    description: 'OrbOracle is a decentralized oracle network providing reliable price feeds and data for DeFi applications.',
    images: ['https://orboracle.stability.nexus/og-image.png'],
    creator: '@StabilityNexus',
    site: '@StabilityNexus',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <WalletProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col">
              <Navigation />
              <div className="flex-grow">
                {children}
              </div>
              <ClientFooter />
              <Toaster />
            </main>
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  )
}