'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { readContract, simulateContract, writeContract } from '@wagmi/core'
import { ArrowRight, Check, Copy, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAccount, useChainId, useConfig, usePublicClient } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { OracleMetadataForm } from '@/components/oracle/OracleMetadataForm'
import { OracleParametersForm } from '@/components/oracle/OracleParametersForm'
import {
  createOracleSchema,
  type CreateOracleFormValues,
} from '@/lib/schemas/createOracleSchema'
import { OracleFactoryAbi } from '@/utils/abi/OracleFactory'
import { OracleFactories } from '@/utils/addresses'

const DEFAULT_VALUES = {
  name: '',
  description: '',
  ownerAddress: '',
  weightToken: '',
  reward: '1000',
  halfLifeSeconds: '3600',
  quorumBps: '2000',
  depositLock: '3600',
  withdrawLock: '3600',
  alpha: '1',
} as unknown as CreateOracleFormValues

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function CreateOracleIntegrated() {
  const account = useAccount()
  const activeChainId = useChainId()
  const config = useConfig()
  const publicClient = usePublicClient({ chainId: activeChainId })

  const [submitted, setSubmitted] = useState(false)
  const [hashTx, setHashTx] = useState('')
  const [oracleAddress, setOracleAddress] = useState('')
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CreateOracleFormValues>({
    resolver: zodResolver(createOracleSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const weightToken = watch('weightToken')
  useEffect(() => {
    const currentOwner = getValues('ownerAddress')

    if (account.address && !dirtyFields.ownerAddress && !currentOwner) {
      setValue('ownerAddress', account.address, {
        shouldDirty: false,
        shouldTouch: false,
      })
    }
  }, [account.address, dirtyFields.ownerAddress, getValues, setValue])

  useEffect(() => {
    setSubmitted(false)
    setHashTx('')
    setOracleAddress('')
  }, [activeChainId])

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedValue(text)
      window.setTimeout(() => setCopiedValue((current) => (current === text ? null : current)), 1500)
      toast({
        title: 'Copied',
        description: `${label} copied to clipboard.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Copy failed',
        description: `Unable to copy the ${label.toLowerCase()}.`,
        variant: 'destructive',
      })
    }
  }

  const getExplorerUrl = (txHash: string) => {
    const explorer = publicClient?.chain?.blockExplorers?.default?.url
    return explorer ? `${explorer}/tx/${txHash}` : undefined
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!account.address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      })
      return
    }

    const factoryAddress = OracleFactories[activeChainId as keyof typeof OracleFactories]

    if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
      toast({
        title: 'Unsupported network',
        description: 'Oracle Factory not deployed on this network.',
        variant: 'destructive',
      })
      return
    }

    const constructorArgs = [
      data.name,
      data.description,
      data.weightToken as `0x${string}`,
      BigInt(data.reward),
      BigInt(data.halfLifeSeconds),
      BigInt(data.quorumBps),
      BigInt(data.depositLock),
      BigInt(data.withdrawLock),
      BigInt(data.alpha),
    ] as const

    try {
      const { request } = await simulateContract(config, {
        address: factoryAddress,
        abi: OracleFactoryAbi,
        functionName: 'createOracle',
        args: constructorArgs,
        account: account.address,
      })

      const tx = await writeContract(config, request)
      setHashTx(tx)

      toast({
        title: 'Transaction submitted',
        description: 'Your oracle is being created...',
      })

      window.setTimeout(async () => {
        try {
          const allOracles = (await readContract(config, {
            address: factoryAddress,
            abi: OracleFactoryAbi,
            functionName: 'allOracles',
          })) as Array<{ oracle: string; token: string; creator: string }>

          if (allOracles.length > 0) {
            const latestOracle = allOracles[allOracles.length - 1]
            setOracleAddress(latestOracle.oracle)
          }

          setSubmitted(true)
          toast({
            title: 'Oracle created',
            description: 'Your oracle has been successfully deployed.',
          })
        } catch (error) {
          console.error('Error getting oracle address:', error)
          setSubmitted(true)
        }
      }, 5000)
    } catch (error: unknown) {
      console.error(error)
      const description =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating the oracle.'

      toast({
        title: 'Creation failed',
        description,
        variant: 'destructive',
      })
    }
  })

  if (submitted) {
    const explorerUrl = hashTx ? getExplorerUrl(hashTx) : undefined

    return (
      <div
        className='relative flex min-h-screen items-center justify-center bg-background font-[oblique] tracking-wide'
        style={{ fontStyle: 'oblique 12deg' }}
      >
        <Card className='mx-auto max-w-2xl border-primary/30 bg-background/95 shadow-xl backdrop-blur-sm'>
          <CardContent className='space-y-6 py-8 text-center'>
            <div className='space-y-3'>
              <h2
                className='text-3xl font-medium text-slate-100'
                style={{ fontStyle: 'oblique 15deg' }}
              >
                Oracle Created Successfully!
              </h2>
              <p className='text-base text-slate-200'>
                Your oracle has been deployed and is ready to use.
              </p>

              {oracleAddress && (
                <div className='rounded-lg border border-blue-100 bg-slate-800/50 p-3 font-mono text-sm'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='font-medium text-blue-300'>
                      {formatAddress(oracleAddress)}
                    </span>
                    <button
                      type='button'
                      onClick={() => copyText(oracleAddress, 'Oracle address')}
                      className='rounded px-2 py-1 text-xs transition-colors hover:bg-blue-600/20'
                    >
                      {copiedValue === oracleAddress ? (
                        <Check className='h-3 w-3' />
                      ) : (
                        <Copy className='h-3 w-3' />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {hashTx && !explorerUrl && (
                <div className='rounded-lg border border-blue-100 bg-slate-800/50 p-3 text-left text-sm'>
                  <p className='mb-2 text-slate-300'>Transaction hash</p>
                  <div className='flex items-center justify-between gap-3 font-mono'>
                    <span className='break-all text-blue-300'>{hashTx}</span>
                    <button
                      type='button'
                      onClick={() => copyText(hashTx, 'Transaction hash')}
                      className='rounded px-2 py-1 text-xs transition-colors hover:bg-blue-600/20'
                    >
                      {copiedValue === hashTx ? (
                        <Check className='h-3 w-3' />
                      ) : (
                        <Copy className='h-3 w-3' />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row'>
              {hashTx && explorerUrl && (
                <Link href={explorerUrl} target='_blank'>
                  <Button
                    variant='outline'
                    className='h-10 border-blue-200 px-4 hover:bg-blue-600/10'
                  >
                    View Transaction
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              )}
              {oracleAddress && (
                <Link href={`/o?chainId=${activeChainId}&oracle=${oracleAddress}`}>
                  <Button className='h-10 bg-blue-600 px-6 hover:bg-blue-700'>
                    Go to Oracle
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              )}
              <Link href='/explorer'>
                <Button
                  variant='outline'
                  className='h-10 border-blue-200 px-4 hover:bg-blue-600/10'
                >
                  Browse Oracles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className='font-[oblique] tracking-wide text-slate-100'
      style={{ fontStyle: 'oblique 15deg' }}
    >
      <form onSubmit={onSubmit} className='space-y-8'>
        <OracleMetadataForm register={register} errors={errors} />
        <OracleParametersForm
          register={register}
          errors={errors}
          setValue={setValue}
          watchWeightToken={weightToken}
        />

        <div className='mx-auto flex justify-center'>
          <Button
            type='submit'
            size='lg'
            className='mx-auto max-w-4xl border border-slate-400 bg-black text-white hover:bg-primary'
            disabled={isSubmitting || !account.address}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating Oracle...
              </>
            ) : !account.address ? (
              'Connect Wallet to Create Oracle'
            ) : (
              <>
                Create Oracle
                <ArrowRight className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
