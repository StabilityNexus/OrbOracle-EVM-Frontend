import { BaseError } from 'viem'

function cleanMessage(message?: string | null) {
  if (!message) {
    return undefined
  }

  const trimmed = message.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.replace(/\s+/g, ' ')
}

export function formatContractError(error: unknown, fallback: string) {
  if (error instanceof BaseError) {
    const messages = [
      cleanMessage(error.shortMessage),
      cleanMessage(error.details),
      cleanMessage(error.message),
    ].filter(Boolean) as string[]

    if (messages.length > 0) {
      return messages[0]
    }
  }

  if (error instanceof Error) {
    const direct = cleanMessage(error.message)
    if (direct) {
      return direct
    }
  }

  return fallback
}
