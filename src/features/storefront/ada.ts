import { z } from 'zod'
import garment from '../../../content/ada.json' with { type: 'json' }
import { assetPath } from './content'

export const sizes = ['XS', 'S', 'M', 'L'] as const
export type Size = (typeof sizes)[number]
export const tiers = ['individual', 'boutique'] as const
export type Tier = (typeof tiers)[number]
export const tierLabel = { individual: 'Individual', boutique: 'Wholesale boutique' } as const

const text = z.string().trim().min(1).max(500)
const listText = text.max(120)
const galleryPhoto = z.object({
  image: assetPath('/brand/ada/photos/'),
  title: listText,
  alt: text,
})
const gallery = z
  .tuple([galleryPhoto], galleryPhoto)
  .refine((photos) => photos.length <= 8, 'Use no more than eight photographs.')
  .refine(
    (photos) => new Set(photos.map((photo) => photo.image)).size === photos.length,
    'Each photograph must use a unique image.',
  )

export const adaContentSchema = z.object({
  title: text,
  description: z.string().trim().min(1).max(2_000),
  shortTitle: listText,
  weight: listText,
  style: z.array(listText).min(1).max(8),
  color: listText,
  materials: z.array(listText).min(1).max(8),
  gallery,
})

const { gallery: photos, ...specs } = adaContentSchema.parse(garment)

export const ada = {
  ...specs,
  photos,
  id: 'ada-wax-black',
  currency: 'USD',
  prices: { individual: 14000, boutique: 7000 } satisfies Record<Tier, number>,
  sku: { XS: 'ADA-WB-XS', S: 'ADA-WB-S', M: 'ADA-WB-M', L: 'ADA-WB-L' } satisfies Record<
    Size,
    string
  >,
} as const

export const printHero = ada.photos[0]
