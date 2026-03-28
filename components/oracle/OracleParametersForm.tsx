'use client'

import { Info } from 'lucide-react'
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CreateOracleFormValues } from '@/lib/schemas/createOracleSchema'
import TokenSelector from '@/components/TokenSelector'

interface OracleParametersFormProps {
  register: UseFormRegister<CreateOracleFormValues>
  errors: FieldErrors<CreateOracleFormValues>
  setValue: UseFormSetValue<CreateOracleFormValues>
  watchWeightToken: string
}

function FieldInfo({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          aria-label={`More information about this field`}
          className='inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-300 transition-colors hover:text-slate-100'
        >
          <Info className='h-3 w-3' aria-hidden='true' />
        </button>
      </TooltipTrigger>
      <TooltipContent side='top' className='max-w-xs text-sm'>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function OracleParametersForm({
  register,
  errors,
  setValue,
  watchWeightToken,
}: OracleParametersFormProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Card className='mx-auto max-w-4xl border-2 border-blue-200 bg-card shadow-sm'>
        <CardHeader className='border-b border-blue-100'>
          <CardTitle className='text-xl text-slate-100'>Oracle Parameters</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-4 pt-4'>
          <input type='hidden' {...register('weightToken')} />

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='weightToken' className='text-md text-slate-100'>
                Weight Token (ERC20) *
              </Label>
              <FieldInfo label='ERC20 token address used for voting weight calculation. You can select from supported tokens or enter a custom address.' />
            </div>
            <TokenSelector
              value={watchWeightToken}
              onChange={(address) =>
                setValue('weightToken', address as CreateOracleFormValues['weightToken'], {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              error={errors.weightToken?.message}
              placeholder='0x...'
              label=''
              required={true}
            />
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='reward' className='text-md text-slate-100'>
                Reward (out of 1e5) *
              </Label>
              <FieldInfo label='Example: 1000 = 1.000% of contract balance per reward slice' />
            </div>
            <Input
              id='reward'
              type='number'
              {...register('reward')}
              aria-invalid={!!errors.reward}
              aria-describedby={errors.reward ? 'reward-error' : undefined}
              placeholder='1000'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.reward ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.reward && (
              <p id='reward-error' role='alert' className='text-xs text-red-400'>
                {errors.reward.message}
              </p>
            )}
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='halfLifeSeconds' className='text-md text-slate-100'>
                Half Life Seconds *
              </Label>
              <FieldInfo label='Controls time-decay in EWMA (Exponentially Weighted Moving Average)' />
            </div>
            <Input
              id='halfLifeSeconds'
              type='number'
              {...register('halfLifeSeconds')}
              aria-invalid={!!errors.halfLifeSeconds}
              aria-describedby={errors.halfLifeSeconds ? 'halfLifeSeconds-error' : undefined}
              placeholder='3600'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.halfLifeSeconds ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.halfLifeSeconds && (
              <p id='halfLifeSeconds-error' role='alert' className='text-xs text-red-400'>
                {errors.halfLifeSeconds.message}
              </p>
            )}
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='quorumBps' className='text-md text-slate-100'>
                Quorum (basis points) *
              </Label>
              <FieldInfo label='Minimum participation required (0-10000). 20% = 2000 bps' />
            </div>
            <Input
              id='quorumBps'
              type='number'
              {...register('quorumBps')}
              aria-invalid={!!errors.quorumBps}
              aria-describedby={errors.quorumBps ? 'quorumBps-error' : undefined}
              placeholder='2000'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.quorumBps ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.quorumBps && (
              <p id='quorumBps-error' role='alert' className='text-xs text-red-400'>
                {errors.quorumBps.message}
              </p>
            )}
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='depositLock' className='text-md text-slate-100'>
                Deposit Lock Period (sec) *
              </Label>
              <FieldInfo label='Time period deposits are locked before they can be withdrawn' />
            </div>
            <Input
              id='depositLock'
              type='number'
              {...register('depositLock')}
              aria-invalid={!!errors.depositLock}
              aria-describedby={errors.depositLock ? 'depositLock-error' : undefined}
              placeholder='3600'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.depositLock ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.depositLock && (
              <p id='depositLock-error' role='alert' className='text-xs text-red-400'>
                {errors.depositLock.message}
              </p>
            )}
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='withdrawLock' className='text-md text-slate-100'>
                Withdrawal Lock Period (sec) *
              </Label>
              <FieldInfo label='Time period before withdrawal requests can be processed' />
            </div>
            <Input
              id='withdrawLock'
              type='number'
              {...register('withdrawLock')}
              aria-invalid={!!errors.withdrawLock}
              aria-describedby={errors.withdrawLock ? 'withdrawLock-error' : undefined}
              placeholder='3600'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.withdrawLock ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.withdrawLock && (
              <p id='withdrawLock-error' role='alert' className='text-xs text-red-400'>
                {errors.withdrawLock.message}
              </p>
            )}
          </div>

          <div className='col-span-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='alpha' className='text-md text-slate-100'>
                Alpha *
              </Label>
              <FieldInfo label='Scalar in reward formula. Keep small unless you understand the economics' />
            </div>
            <Input
              id='alpha'
              type='number'
              {...register('alpha')}
              aria-invalid={!!errors.alpha}
              aria-describedby={errors.alpha ? 'alpha-error' : undefined}
              placeholder='1'
              className={`border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.alpha ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.alpha && (
              <p id='alpha-error' role='alert' className='text-xs text-red-400'>
                {errors.alpha.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
