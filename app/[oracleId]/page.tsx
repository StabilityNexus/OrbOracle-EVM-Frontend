import { notFound } from 'next/navigation'
import InteractionClient from './InteractionClient'
import { Suspense } from 'react'
import { mockOracles } from '@/lib/mock-data'

interface OraclePageProps {
  params: {
    oracleId: string
  }
}

export async function generateStaticParams() {
  return mockOracles.map((oracle) => ({
    oracleId: oracle.id,
  }))
}

export default function VaultPage({ params }: OraclePageProps) {
  return (
    <Suspense>
      <InteractionClient oracleId={params.oracleId} />
    </Suspense>
  )
}
