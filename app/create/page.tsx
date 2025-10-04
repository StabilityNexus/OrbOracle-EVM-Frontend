import { Navigation } from "@/components/navigation"
import CreateOracleIntegrated from "@/components/createOracle"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl text-slate-200 mb-2 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Create Oracle</h1>
          <p className="text-slate-200 text-xl max-w-3xl mx-auto">
            Deploy the on‑chain Oracle contract by providing the exact constructor parameters.
          </p>
        </div>
        <CreateOracleIntegrated />
      </div>
    </div>
  )
}
