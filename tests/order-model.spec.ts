import { expect, test } from '@playwright/test'
import {
  blankOrder,
  orderMessage,
  orderSchema,
  quantityMessage,
  quoteOrder,
} from '../src/features/buyer-sheet/order'

test('quotes selected sizes in cents for the selected tier', () => {
  const quote = quoteOrder({
    tier: 'boutique',
    quantities: { XS: '', S: '2', M: '0', L: '1' },
  })

  expect(quote).toEqual({
    tier: 'boutique',
    tierLabel: 'Wholesale boutique',
    unitPriceCents: 7000,
    lines: [
      { size: 'S', quantity: 2, amountCents: 14000 },
      { size: 'L', quantity: 1, amountCents: 7000 },
    ],
    subtotalCents: 21000,
  })
})

test('rejects malformed quantities without making a partial quote', () => {
  expect(orderSchema.safeParse(blankOrder).error?.issues[0]?.message).toBe(orderMessage)

  for (const quantity of ['1.5', '1e5', '100000']) {
    const values = { ...blankOrder, quantities: { ...blankOrder.quantities, XS: quantity } }
    expect(orderSchema.safeParse(values).error?.issues[0]?.message).toBe(quantityMessage)
    expect(quoteOrder(values)).toBeNull()
  }
})
