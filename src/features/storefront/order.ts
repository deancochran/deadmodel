import { z } from 'zod'
import { ada, type Size, sizes, type Tier, tierLabel, tiers } from './ada'

export const quantityMessage = 'Use a whole number from 0 to 99,999.'
export const orderMessage = 'Enter a quantity for at least one size.'

const quantity = z
  .string()
  .regex(/^\d{0,5}$/, quantityMessage)
  .transform(Number)

const draftSchema = z.object({
  tier: z.enum(tiers),
  quantities: z.object({
    XS: quantity,
    S: quantity,
    M: quantity,
    L: quantity,
  }),
})

export const orderSchema = draftSchema.refine(
  ({ quantities }) => sizes.some((size) => quantities[size] > 0),
  { message: orderMessage, path: ['quantities', 'XS'] },
)

export type OrderValues = z.input<typeof orderSchema>
export type ValidOrder = z.output<typeof orderSchema>

export const blankOrder: OrderValues = {
  tier: 'individual',
  quantities: { XS: '', S: '', M: '', L: '' },
}

export type OrderLine = {
  size: Size
  quantity: number
  amountCents: number
}

export type OrderQuote = {
  tier: Tier
  tierLabel: string
  unitPriceCents: number
  lines: OrderLine[]
  subtotalCents: number
}

export function quoteOrder(draft: OrderValues): OrderQuote | null {
  const parsed = draftSchema.safeParse(draft)
  if (!parsed.success) return null
  const { tier, quantities } = parsed.data

  const unitPriceCents = ada.prices[tier]
  const lines = sizes.flatMap((size) => {
    const quantity = quantities[size]
    return quantity > 0 ? [{ size, quantity, amountCents: quantity * unitPriceCents }] : []
  })

  return {
    tier,
    tierLabel: tierLabel[tier],
    unitPriceCents,
    lines,
    subtotalCents: lines.reduce((subtotal, line) => subtotal + line.amountCents, 0),
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: ada.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatCents(cents: number) {
  return currencyFormatter.format(cents / 100)
}
