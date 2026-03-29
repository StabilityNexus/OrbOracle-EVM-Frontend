"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { OracleCard } from "@/components/oracle-card";
import { UnsupportedNetworkEmptyState } from "@/components/UnsupportedNetworkEmptyState";
import { Input } from "@/components/ui/input";
import { useOracles } from "@/hooks/useOracles";

export function ExplorerContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { oracles, loading, error } = useOracles();
  const isUnsupportedNetwork =
    error?.includes("Oracle Factory not deployed") ?? false;

  const filteredOracles = useMemo(() => {
    return oracles.filter((oracle) => {
      const matchesSearch =
        oracle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch && oracle.status === "active";
    });
  }, [oracles, searchQuery]);

  return (
    <div className="container mx-auto px-6 pb-12 pt-24">
      <div className="mb-12 text-center">
        <h1
          className="mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-5xl font-medium tracking-wide text-transparent"
          style={{ fontStyle: "oblique 15deg" }}
        >
          Orb Oracle Explorer
        </h1>
      </div>

      <div className="mx-auto mb-12 max-w-2xl">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
          <Input
            placeholder="Search oracles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isUnsupportedNetwork}
            className="h-12 rounded-xl border border-primary/30 bg-card/50 pl-4 transition-all duration-300 group-focus-within:scale-105 focus:border-primary/50 focus:bg-card/70 focus:pl-12 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {isUnsupportedNetwork ? (
        <UnsupportedNetworkEmptyState />
      ) : loading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-primary" />
          <p className="mb-8 text-xl font-light text-slate-200">
            Loading oracles from blockchain...
          </p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="mb-6 text-red-500">
            <Search className="mx-auto mb-4 h-16 w-16 opacity-50" />
          </div>
          <p className="mb-8 text-xl font-light text-red-400">{error}</p>
        </div>
      ) : filteredOracles.length > 0 ? (
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredOracles.map((oracle) => (
            <OracleCard key={oracle.id} oracle={oracle} />
          ))}
        </div>
      ) : oracles.length === 0 ? (
        <div className="py-20 text-center">
          <Search className="mx-auto mb-6 h-16 w-16 opacity-30" />
          <p className="mb-8 text-xl font-light text-slate-200">
            No oracles deployed yet
          </p>
          <p className="mb-8 text-sm text-slate-400">
            Be the first to create an oracle on this network!
          </p>
          <Link
            href="/create"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create Oracle
          </Link>
        </div>
      ) : (
        <div className="py-20 text-center">
          <Search className="mx-auto mb-6 h-16 w-16 opacity-30" />
          <p className="mb-8 text-xl font-light text-slate-200">
            No oracles match your search
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
