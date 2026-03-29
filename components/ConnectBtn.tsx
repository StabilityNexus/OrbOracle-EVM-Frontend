"use client";

import useNetworkGuard from "@/hooks/useNetworkGuard";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const CONNECT_WALLET = "Connect Wallet";
const CONNECTING = "Connecting";
const DISCONNECT = "Disconnect";
const WRONG_NETWORK = "Wrong Network";
const NETWORK_FALLBACK = "Network";

const WALLET_METADATA: Record<string, { label: string; priority?: number }> = {
  "io.metamask": { label: "MetaMask", priority: 10 },
  "com.coinbase.wallet": { label: "Coinbase Wallet", priority: 9 },
  "app.phantom": { label: "Phantom", priority: 8 },
  "com.brave.wallet": { label: "Brave Wallet", priority: 7 },
  "app.backpack": { label: "Backpack", priority: 6 },
  "io.xdefi": { label: "Ctrl Wallet", priority: 5 },
  "io.rabby": { label: "Rabby Wallet", priority: 4 },
};

interface ConnectorParams {
  ready?: boolean;
  uid?: string;
}

const getConnectorParams = (value: unknown): ConnectorParams => {
  if (typeof value !== "object" || value === null) return {};
  const record = value as Record<string, unknown>;
  return {
    ready: typeof record.ready === "boolean" ? record.ready : undefined,
    uid: typeof record.uid === "string" ? record.uid : undefined,
  };
};

const emptySubscribe = () => () => {};

export default function ConnectBtn() {
  const { isConnected, address, chain } = useAccount();
  const { connectors, connect, isPending, variables } = useConnect();
  const { disconnect } = useDisconnect();
  const { isWrongNetwork, isSwitchPending, targetChains, switchNetwork, chainId } =
    useNetworkGuard();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const walletTriggerRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const networkMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const isSwitchingRef = useRef(false);
  const hadSwitchAttemptRef = useRef(false);

  const prevConnectedRef = useRef(isConnected);

  useLayoutEffect(() => {
    if (!prevConnectedRef.current && isConnected) {
      setIsWalletModalOpen(false);
    }
    prevConnectedRef.current = isConnected;
  }, [isConnected]);

  useEffect(() => {
    if (!isWalletModalOpen) {
      previouslyFocusedRef.current?.focus();
      return;
    }

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : walletTriggerRef.current;

    closeButtonRef.current?.focus();
  }, [isWalletModalOpen]);

  useEffect(() => {
    if (!isWalletModalOpen) return;
    window.dispatchEvent(new CustomEvent("eip6963:requestProvider"));
    const retry = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("eip6963:requestProvider"));
    }, 300);
    return () => clearTimeout(retry);
  }, [isWalletModalOpen]);

  useEffect(() => {
    if (!isNetworkMenuOpen && !isAccountMenuOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      const target = e.target as Node;
      if (networkMenuRef.current && !networkMenuRef.current.contains(target)) {
        setIsNetworkMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isNetworkMenuOpen, isAccountMenuOpen]);

  useEffect(() => {
    if (!isNetworkMenuOpen && !isAccountMenuOpen && !isWalletModalOpen) return;

    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsNetworkMenuOpen(false);
      setIsAccountMenuOpen(false);
      setIsWalletModalOpen(false);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isNetworkMenuOpen, isAccountMenuOpen, isWalletModalOpen]);

  useEffect(() => {
    if (
      !isWrongNetwork &&
      isNetworkMenuOpen &&
      !isSwitchPending &&
      !isSwitchingRef.current &&
      hadSwitchAttemptRef.current
    ) {
      hadSwitchAttemptRef.current = false;
      setIsNetworkMenuOpen(false);
    }
  }, [isWrongNetwork, isNetworkMenuOpen, isSwitchPending, chainId]);

  useEffect(() => {
    if (isNetworkMenuOpen) {
      setIsNetworkMenuOpen(false);
    }
  }, [chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const isInSafeIframe =
    typeof window !== "undefined" && window.self !== window.top;

  const enrichedConnectors = useMemo(() => {
    const connectorMap = new Map<string, (typeof connectors)[number]>();
    for (const connector of connectors) {
      const key = `${connector.id}:${connector.name}`;
      if (!connectorMap.has(key)) connectorMap.set(key, connector);
    }

    const dedupedConnectors = Array.from(connectorMap.values());
    const hasNamedInjectedWallet = dedupedConnectors.some((connector) => {
      const name = connector.name.toLowerCase();
      const id = connector.id.toLowerCase();
      return name !== "injected" && id !== "injected";
    });

    const visibleConnectors = dedupedConnectors.filter((connector) => {
      const id = connector.id.toLowerCase();
      const name = connector.name.toLowerCase();
      if (id === "safe" && !isInSafeIframe) return false;
      if (!hasNamedInjectedWallet) return true;
      return name !== "injected" && id !== "injected";
    });

    return visibleConnectors
      .map((connector) => {
        const connectorParams = getConnectorParams(connector);
        if (connectorParams.ready === false) return null;
        const meta = WALLET_METADATA[connector.id] ?? {};
        return {
          connector,
          label: meta.label ?? connector.name,
          priority: meta.priority ?? 0,
          connectorParams,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.priority - a.priority);
  }, [connectors, isInSafeIframe]);

  const pendingConnectorParams = useMemo(
    () => getConnectorParams(variables?.connector),
    [variables?.connector]
  );

  if (!mounted) return null;

  if (isConnected) {
    return (
      <div className="z-50 flex items-center gap-2 font-bold">
        <div className="relative" ref={networkMenuRef}>
          <button
            onClick={() => {
              setIsNetworkMenuOpen((open) => !open);
              setIsAccountMenuOpen(false);
            }}
            aria-expanded={isNetworkMenuOpen}
            aria-haspopup="true"
            className={
              isWrongNetwork
                ? "rounded-xl bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-shadow duration-200 hover:shadow-red-300/40"
                : "hidden items-center gap-1.5 rounded-xl bg-zinc-300 px-3 py-2 text-zinc-800 transition-colors duration-150 hover:bg-zinc-400 sm:flex dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            }
          >
            {isWrongNetwork ? (
              <span>{WRONG_NETWORK}</span>
            ) : (
              <>
                <span className="hidden text-sm sm:inline">
                  {chain?.name || (chainId ? `Chain ${chainId}` : NETWORK_FALLBACK)}
                </span>
                <span className="text-xs sm:hidden">N</span>
                <span className="hidden opacity-70 sm:inline">v</span>
              </>
            )}
          </button>

          {isNetworkMenuOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl bg-zinc-100 shadow-lg dark:bg-zinc-800">
              {targetChains.map((x) => (
                <button
                  key={x.id}
                  disabled={
                    isSwitchPending ||
                    (!isWrongNetwork && typeof chainId === "number" && x.id === chainId)
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={async () => {
                    if (isSwitchingRef.current) return;
                    isSwitchingRef.current = true;
                    hadSwitchAttemptRef.current = true;
                    try {
                      await switchNetwork(x.id);
                    } catch (err) {
                      hadSwitchAttemptRef.current = false;
                      console.warn("[Orb] switchNetwork failed:", err);
                    } finally {
                      isSwitchingRef.current = false;
                    }
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:opacity-50 dark:text-white dark:hover:bg-zinc-700"
                >
                  {x.name}
                  {!isWrongNetwork && x.id === chainId && " (Current)"}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isWrongNetwork && (
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => {
                setIsAccountMenuOpen((open) => !open);
                setIsNetworkMenuOpen(false);
              }}
              className="flex items-center overflow-hidden rounded-xl bg-zinc-300 transition-colors hover:bg-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span className="px-3 py-2 text-zinc-800 dark:text-white font-bold text-sm">
                {displayName}
              </span>
              <span className="pr-2 text-black opacity-70 dark:text-white">v</span>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-full overflow-hidden rounded-xl bg-zinc-100 shadow-lg dark:bg-zinc-800">
                <button
                  onClick={() => {
                    disconnect();
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-center text-sm font-bold text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  {DISCONNECT}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={walletTriggerRef}
        onClick={() => setIsWalletModalOpen(true)}
        className="rounded-xl bg-green-500 hover:bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all dark:bg-green-600 dark:hover:bg-green-500"
      >
        {CONNECT_WALLET}
      </button>

      {isWalletModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setIsWalletModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-wallet-title"
            className="relative z-[101] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="connect-wallet-title"
                className="text-lg font-bold text-zinc-900 dark:text-white"
              >
                {CONNECT_WALLET}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={() => setIsWalletModalOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <span className="text-zinc-600 dark:text-zinc-300">x</span>
              </button>
            </div>

            {enrichedConnectors.length > 0 ? (
              <div className="grid gap-2">
                {enrichedConnectors.map(({ connector, label, connectorParams }) => {
                  const isThisPending =
                    isPending && pendingConnectorParams.uid === connectorParams.uid;
                  return (
                    <button
                      key={connectorParams.uid || connector.id}
                      disabled={isPending || connectorParams.ready === false}
                      onClick={() => {
                        connect(
                          { connector },
                          { onSuccess: () => setIsWalletModalOpen(false) }
                        );
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <span>{label}</span>
                      {isThisPending ? (
                        <span className="text-xs text-green-500">{CONNECTING}...</span>
                      ) : (
                        <span className="text-xs text-zinc-400">Open</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  No wallet extensions detected.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Install MetaMask, Rabby, or Coinbase Wallet extension and reload.
                </p>
                <div className="grid gap-2">
                  {[
                    { label: "MetaMask", url: "https://metamask.io/download/" },
                    { label: "Rabby", url: "https://rabby.io/" },
                    {
                      label: "Coinbase",
                      url: "https://www.coinbase.com/wallet/downloads",
                    },
                  ].map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
