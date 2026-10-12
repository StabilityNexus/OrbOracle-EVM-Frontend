"use client"

import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: 'USE', href: '/use' },
    { label: 'DEPLOY', href: '/deploy' },
    { label: 'OPERATE', href: '/operate' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-close menu when navigating
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const checkActive = (href: string) => {
    if (href === '/deploy') {
      return pathname === '/deploy' || pathname?.startsWith('/deploy/') || pathname === '/create' || pathname?.startsWith('/create/')
    }
    if (href === '/use') {
      return pathname === '/use' || pathname?.startsWith('/use/') || pathname === '/explorer' || pathname?.startsWith('/explorer/') || pathname === '/o' || pathname?.startsWith('/o/')
    }
    if (href === '/operate') {
      return pathname === '/operate' || pathname?.startsWith('/operate/')
    }
    return pathname === href
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      scrolled ? "pt-6 px-4" : "pt-0 px-0"
    }`}>
      {/* Dynamic Morphing Header Capsule (Expands height dynamically for mobile menu) */}
      <div className={`pointer-events-auto flex flex-col justify-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border overflow-hidden h-auto ${
        scrolled 
          ? `w-full max-w-[640px] md:max-w-[800px] ${menuOpen ? "max-h-[350px] rounded-[26px] pb-4" : "max-h-[52px] rounded-[26px]"} bg-zinc-950/45 border-white/10 backdrop-blur-lg px-4 sm:px-6 shadow-2xl` 
          : `w-full max-w-full ${menuOpen ? "max-h-[380px] pb-4" : "max-h-[68px]"} bg-zinc-950/10 border-white/5 backdrop-blur-md rounded-none px-6 sm:px-12 shadow-none`
      }`}>
        
        {/* Main Row */}
        <div className={`flex items-center justify-between w-full transition-all duration-500 shrink-0 ${scrolled ? "h-[50px]" : "h-[50px] sm:h-[66px]"}`}>
          
          {/* Brand Title (Left) */}
          <div className="flex-1 flex justify-start">
            <Link 
              href="/" 
              className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white hover:text-primary transition-colors flex items-center select-none"
            >
              ORB ORACLE
            </Link>
          </div>

          {/* Desktop Center Links (Hidden on mobile < md) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = checkActive(item.href);
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "text-black bg-white font-semibold shadow-md" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right Connect Wallet (Desktop) / Hamburger Trigger (Mobile) */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            {/* Desktop Connect Wallet button - hidden on mobile < md */}
            <div className="hidden md:block">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button 
                              onClick={openConnectModal} 
                              type="button"
                              className="h-8 px-4 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 shadow-md"
                            >
                              CONNECT
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button 
                              onClick={openChainModal} 
                              type="button"
                              className="h-8 px-4 rounded-full bg-red-500 text-white font-mono text-xs font-bold tracking-wider hover:bg-red-600 active:scale-[0.98] transition-all duration-300 shadow-md"
                            >
                              WRONG NET
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={openChainModal}
                              style={{ display: 'flex', alignItems: 'center' }}
                              type="button"
                              className="h-8 px-3 rounded-full bg-zinc-900 border border-white/5 text-white font-mono text-xs tracking-wider hover:bg-zinc-800 transition-all duration-300"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              <span className="hidden sm:inline">{chain.name}</span>
                              <span className="inline sm:hidden">{chain.name?.slice(0, 4)}</span>
                            </button>

                            <button 
                              onClick={openAccountModal} 
                              type="button"
                              className="h-8 px-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 shadow-md"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Hamburger Toggle - visible only on mobile < md */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-primary/40 active:scale-95 transition-all duration-300 pointer-events-auto"
              >
                {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Dropdown Panel (Animate expand on menuOpen) */}
        {menuOpen && (
          <div className="flex flex-col items-center space-y-4 py-4 border-t border-white/5 w-full md:hidden transition-all duration-500 animate-fadeIn">
            {/* Nav Items Link List */}
            <div className="flex flex-col items-center space-y-2 w-full">
              {navItems.map((item) => {
                const isActive = checkActive(item.href);
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`w-full text-center py-2 rounded-xl font-mono text-xs tracking-wider transition-all duration-300 ${
                      isActive 
                        ? "text-black bg-white font-semibold shadow-md" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Wallet Connector inside Menu Dropdown */}
            <div className="w-full flex justify-center pt-3 border-t border-white/5">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  if (!connected) {
                    return (
                      <button 
                        onClick={openConnectModal} 
                        type="button"
                        className="w-full h-10 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-wider hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 shadow-md"
                      >
                        CONNECT WALLET
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        type="button"
                        className="w-full h-10 rounded-xl bg-red-500 text-white font-mono text-xs font-bold tracking-wider hover:bg-red-600 active:scale-[0.98] transition-all duration-300 shadow-md"
                      >
                        WRONG NETWORK
                      </button>
                    );
                  }

                  return (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        type="button"
                        className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/5 text-white font-mono text-xs tracking-wider hover:bg-zinc-800 transition-all duration-300"
                      >
                        {chain.hasIcon && chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12, marginRight: 6 }}
                          />
                        )}
                        <span>{chain.name}</span>
                      </button>

                      <button 
                        onClick={openAccountModal} 
                        type="button"
                        className="w-full h-10 px-4 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-wider hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 shadow-md"
                      >
                        {account.displayName}
                      </button>
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
