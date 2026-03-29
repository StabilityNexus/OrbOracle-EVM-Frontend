'use client'

import { Info } from 'lucide-react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CreateOracleFormValues } from '@/lib/schemas/createOracleSchema'

interface OracleMetadataFormProps {
  register: UseFormRegister<CreateOracleFormValues>
  errors: FieldErrors<CreateOracleFormValues>
}

function FieldInfo({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          aria-label={`More information about ${label}`}
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

export function OracleMetadataForm({ register, errors }: OracleMetadataFormProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Card className='mx-auto max-w-4xl border-2 border-blue-200 bg-card shadow-sm'>
        <CardHeader className='border-b border-blue-100'>
          <CardTitle className='text-xl text-slate-100'>Oracle Metadata</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-4 pt-4'>
          <div className='col-span-2 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='name' className='text-md text-slate-100'>
                Name *
              </Label>
              <FieldInfo label='Display name for your oracle' />
            </div>
            <Input
              id='name'
              {...register('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder='ETH/USD Oracle'
              className={`border-0 border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.name ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.name && (
              <p id='name-error' role='alert' className='text-xs text-red-400'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className='col-span-2 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='description' className='text-md text-slate-100'>
                Description *
              </Label>
              <FieldInfo label="Detailed description of your oracle's purpose" />
            </div>
            <Textarea
              id='description'
              {...register('description')}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              placeholder="Describe your oracle's purpose and data source"
              className={`border-0 border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.description ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.description && (
              <p id='description-error' role='alert' className='text-xs text-red-400'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='col-span-2 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Label htmlFor='ownerAddress' className='text-md text-slate-100'>
                Owner Address *
              </Label>
              <FieldInfo label='Address that will own and control the oracle contract' />
            </div>
            <Input
              id='ownerAddress'
              {...register('ownerAddress')}
              aria-invalid={!!errors.ownerAddress}
              aria-describedby={errors.ownerAddress ? 'ownerAddress-error' : undefined}
              placeholder='0x...'
              className={`border-0 border bg-slate-800/50 text-slate-100 placeholder:text-slate-400 ${
                errors.ownerAddress ? 'border-red-500' : 'border-blue-100'
              }`}
            />
            {errors.ownerAddress && (
              <p id='ownerAddress-error' role='alert' className='text-xs text-red-400'>
                {errors.ownerAddress.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
