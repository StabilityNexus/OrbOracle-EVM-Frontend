"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useChainId } from "wagmi";
import { getChainNameForTokenList } from "@/utils/chainMapping";
import { Input } from "@/components/ui/input";

export interface Token {
  id: string;
  symbol: string;
  name: string;
  contract_address: string;
  image?: string;
}

interface TokenSelectorProps {
  value?: string;
  onChange: (address: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  value = "",
  onChange,
  error,
  placeholder = "Enter ERC20 token address or select from list",
  label = "Token Address",
  required = false,
}) => {
  const chainId = useChainId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenFetchError, setTokenFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync manualAddress with value prop
  useEffect(() => {
    if (value) {
      setManualAddress(value);
      // Check if value matches any token in the list
      const matchingToken = tokens.find(
        (token) => token.contract_address.toLowerCase() === value.toLowerCase()
      );
      if (!matchingToken) {
        setIsManualInput(true);
      }
    }
  }, [value, tokens]);

  // Get chain name for token list URL
  const chainName = useMemo(() => getChainNameForTokenList(chainId), [chainId]);

  // Fetch tokens from TokenList repository
  useEffect(() => {
    const fetchTokens = async () => {
      if (!chainName) {
        console.warn(`No token list available for chain ID ${chainId}`);
        return;
      }

      setLoading(true);
      setTokenFetchError(null);
      try {
        const url = `https://raw.githubusercontent.com/StabilityNexus/TokenList/main/${chainName}-tokens.json`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`);
        }
        const data = await response.json();
        // Handle both array and object formats
        const tokenArray = Array.isArray(data) ? data : Object.values(data);
        setTokens(tokenArray as Token[]);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setTokens([]);
        setTokenFetchError("Unable to load tokens. Please try again or enter an address manually.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [chainName, chainId, retryCount]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;

    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.contract_address.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    onChange(token.contract_address);
    setManualAddress(token.contract_address);
    setIsManualInput(false);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  // Handle manual input change
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setManualAddress(address);
    onChange(address);
    setIsManualInput(true);
  };

  // Truncate address for display
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get selected token info for display
  const selectedToken = useMemo(() => {
    if (!value || isManualInput) return null;
    return tokens.find(
      (token) => token.contract_address.toLowerCase() === value.toLowerCase()
    );
  }, [value, tokens, isManualInput]);

  return (
    <div className="w-full space-y-1">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          {selectedToken && !isManualInput ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`w-full h-11 px-4 text-sm outline-none border rounded-xl transition-all bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/40 flex items-center gap-2 font-mono cursor-pointer ${
                error ? "border-red-500" : ""
              }`}
            >
              <img
                src={selectedToken.image || "/stability.svg"}
                alt={selectedToken.symbol}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/stability.svg";
                }}
              />
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-zinc-400">({selectedToken.name})</span>
              <span className="text-zinc-500 ml-auto text-xs">
                {truncateAddress(selectedToken.contract_address)}
              </span>
            </button>
          ) : (
            <Input
              type="text"
              value={manualAddress}
              onChange={handleManualInputChange}
              placeholder={placeholder}
              className={`bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 font-mono ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 h-11 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 text-xs font-semibold uppercase font-mono tracking-wider cursor-pointer"
        >
          {selectedToken && !isManualInput ? "Change" : "Select Token"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      {/* Token Selection Modal (Single-Surface Glass Modal) */}
      {isModalOpen && mounted && createPortal(
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] p-4 backdrop-blur-[12px] transition-all duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-zinc-950/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-lg font-medium text-slate-100">Select Token</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-2xl leading-none w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full pl-10 h-11 border-white/10 text-white bg-white/5 rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
                />
                <svg
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Token List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {loading ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs">
                  Loading tokens...
                </div>
              ) : tokenFetchError ? (
                <div className="text-center py-8 text-red-400 space-y-3" role="alert">
                  <p>{tokenFetchError}</p>
                  <button
                    type="button"
                    onClick={() => setRetryCount((count) => count + 1)}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 rounded-md border border-blue-100 hover:border-blue-200 transition-colors text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs">
                  {searchQuery
                    ? "No tokens found matching your search"
                    : "No tokens available for this chain"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTokens.map((token) => (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => handleTokenSelect(token)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 text-left border border-transparent hover:border-white/10 cursor-pointer"
                    >
                      <img
                        src={token.image || "/stability.svg"}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/stability.svg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-100">
                            {token.symbol}
                          </span>
                          <span className="text-slate-400 text-xs truncate">
                            {token.name}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[10px] font-mono mt-0.5">
                          {truncateAddress(token.contract_address)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Input Option */}
            <div className="p-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setIsManualInput(true);
                  setIsModalOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 text-xs font-semibold uppercase font-mono tracking-wider border border-white/10 hover:border-primary/30 cursor-pointer"
              >
                Enter Custom Address
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TokenSelector;

