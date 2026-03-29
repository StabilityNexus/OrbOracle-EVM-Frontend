import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ExplorerContent } from '@/components/ExplorerContent'
import { UnsupportedNetworkEmptyState } from '@/components/UnsupportedNetworkEmptyState'

export default function ExplorerPage() {
  return (
    <div
      className='min-h-screen bg-background font-[oblique] tracking-wide'
      style={{ fontStyle: 'oblique 12deg' }}
    >
      <ErrorBoundary fallback={<UnsupportedNetworkEmptyState />}>
        <ExplorerContent />
      </ErrorBoundary>
    </div>
  )
}
