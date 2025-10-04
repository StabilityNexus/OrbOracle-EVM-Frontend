import { notFound } from 'next/navigation'
import InteractionClient from './InteractionClient'
import { Suspense } from 'react'

export async function generateStaticParams() {
  return [{ oracleId: 'o' }]
}

export default function OraclePage() {
  return (
    <Suspense>
      <InteractionClient />
    </Suspense>
  )
}
