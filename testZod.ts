import { z } from 'zod'

const isPositiveInteger = (value: string) =>
  /^[0-9]+$/.test(value) && Number(value) > 0

const isNonNegativeInteger = (value: string) =>
  /^[0-9]+$/.test(value) && Number(value) >= 0

export const createOracleSchema = z.object({
  name: z.string().min(1, 'Oracle name is required'),
  description: z.string().min(1, 'Description is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  weightToken: z.string().min(1, 'Weight token address is required'),
  reward: z
    .string()
    .min(1, 'Reward is required')
    .refine((value) => isPositiveInteger(value), {
      message: 'Reward must be a positive integer',
    }),
  halfLifeSeconds: z
    .string()
    .min(1, 'Half life seconds is required')
    .refine((value) => isPositiveInteger(value), {
      message: 'Half life seconds must be a positive integer',
    }),
  quorumBps: z
    .string()
    .min(1, 'Quorum is required')
    .refine((value) => /^[0-9]+$/.test(value), {
      message: 'Quorum must be an integer',
    })
    .refine((value) => Number(value) >= 1 && Number(value) <= 10000, {
      message: 'Quorum must be between 1 and 10000',
    }),
  depositLock: z
    .string()
    .min(1, 'Deposit lock period is required')
    .refine((value) => isPositiveInteger(value), {
      message: 'Deposit lock must be a positive integer',
    }),
  withdrawLock: z
    .string()
    .min(1, 'Withdrawal lock period is required')
    .refine((value) => isPositiveInteger(value), {
      message: 'Withdrawal lock must be a positive integer',
    }),
  alpha: z
    .string()
    .min(1, 'Alpha is required')
    .refine((value) => isNonNegativeInteger(value), {
      message: 'Alpha must be a non-negative integer',
    }),
})

const test = createOracleSchema.safeParse({
  name: "a",
  description: "b",
  ownerAddress: "c",
  weightToken: "d",
  reward: 100, // Number!
  halfLifeSeconds: "100", // String
  quorumBps: undefined, // undefined
  depositLock: 100,
  withdrawLock: 100,
  alpha: 100,
})

console.log(JSON.stringify(test, null, 2))
