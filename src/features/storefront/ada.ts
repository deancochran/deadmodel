import { z } from 'zod'
import garment from '../../../content/ada.json' with { type: 'json' }

export const sizes = ['XS', 'S', 'M', 'L'] as const
export type Size = (typeof sizes)[number]
export const tiers = ['individual', 'boutique'] as const
export type Tier = (typeof tiers)[number]
export const tierLabel = { individual: 'Individual', boutique: 'Wholesale boutique' } as const

const photograph = z.object({
  id: z.string().min(1),
  image: z.string().startsWith('/brand/ada/photos/'),
  title: z.string().min(1),
  alt: z.string().min(1),
})

export const ada = z
  .object({
    id: z.string(),
    title: z.string().trim().min(1),
    weight: z.string(),
    shortTitle: z.string(),
    description: z.string().trim().min(1),
    currency: z.literal('USD'),
    prices: z.record(z.enum(tiers), z.int().positive()),
    sku: z.record(z.enum(sizes), z.string().min(1)),
    style: z.array(z.string()),
    color: z.string(),
    materials: z.array(z.string()),
    // Named first photograph is also the print and order-review image.
    photos: z.tuple([photograph], photograph),
  })
  .parse({
    id: 'ada-wax-black',
    title: garment.title,
    weight: '12.5oz',
    shortTitle: 'ADA fringe denim',
    description: garment.description,
    currency: 'USD',
    prices: { individual: 14000, boutique: 7000 },
    sku: { XS: 'ADA-WB-XS', S: 'ADA-WB-S', M: 'ADA-WB-M', L: 'ADA-WB-L' },
    style: ['Low rise', 'Flare', 'Fringe'],
    color: 'Waxed black',
    materials: ['98% cotton', '2% spandex', 'Deer suede'],
    photos: [
      { id: 'denim', title: 'Full length', ...garment.front },
      { id: 'pockets', title: 'Pocket detail', ...garment.pockets },
      { id: 'fringe', title: 'Fringe detail', ...garment.fringe },
      { id: 'hem', title: 'Flared hem', ...garment.hem },
    ],
  })

export const printHero = ada.photos[0]
export const assetUrl = (file: string) => `${import.meta.env.BASE_URL}brand/ada/${file}`

// Public reference for the Small sample only. Order sizes are not measurement data.
export const smallSampleMeasurements = [
  { point: 'A', label: 'Waist width', note: '', inches: 14.5 },
  { point: 'B', label: 'Front rise', note: 'Including waistband', inches: 6.75 },
  { point: 'C', label: 'Back rise', note: 'Including waistband', inches: 11.25 },
  { point: 'D', label: 'Hip width', note: '7 inches below waist', inches: 19.5 },
  { point: 'E', label: 'Thigh width', note: 'Straight across at crotch', inches: 10.5 },
  { point: 'F', label: 'Knee width', note: '33 cm below crotch', inches: 7.2 },
  { point: 'G', label: 'Leg opening width', note: '', inches: 10.75 },
  { point: 'H', label: 'Inseam', note: '', inches: 36 },
  { point: 'I', label: 'Length', note: 'Outseam', inches: 40.75 },
] as const
