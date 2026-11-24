import { z } from 'zod'

export const sizes = ['XS', 'S', 'M', 'L'] as const
export type Size = (typeof sizes)[number]
export const tiers = ['individual', 'boutique'] as const
export type Tier = (typeof tiers)[number]
export const tierLabel = { individual: 'Individual', boutique: 'Wholesale boutique' } as const

const photograph = z.object({
  id: z.string().min(1),
  file: z.string().min(1),
  title: z.string().min(1),
  alt: z.string().min(1),
  width: z.int().positive(),
  height: z.int().positive(),
})

export const ada = z
  .object({
    id: z.string(),
    title: z.string(),
    weight: z.string(),
    shortTitle: z.string(),
    description: z.string(),
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
    title: 'ADA LOW-RISE WAX BLACK FRINGE DENIM',
    weight: '12.5oz',
    shortTitle: 'ADA fringe denim',
    description:
      'Cut low on the hip, with a flared hem that falls over the shoe. Deer suede fringe follows the outer leg. Turquoise-colored stones sit against the waxed black denim.',
    currency: 'USD',
    prices: { individual: 14000, boutique: 7000 },
    sku: { XS: 'ADA-WB-XS', S: 'ADA-WB-S', M: 'ADA-WB-M', L: 'ADA-WB-L' },
    style: ['Low rise', 'Flare', 'Fringe'],
    color: 'Waxed black',
    materials: ['98% cotton', '2% spandex', 'Deer suede'],
    photos: [
      {
        id: 'denim',
        title: 'Full length',
        file: 'ada-denim.webp',
        width: 614,
        height: 796,
        alt: 'Front of the ADA jean on a model, showing black flared legs, side fringe, and turquoise-colored embellishments.',
      },
      {
        id: 'pockets',
        title: 'Pocket detail',
        file: 'ada-pockets.webp',
        width: 328,
        height: 426,
        alt: 'Waist and pocket detail with silver hardware and curved stitched motifs.',
      },
      {
        id: 'fringe',
        title: 'Fringe detail',
        file: 'ada-fringe.webp',
        width: 200,
        height: 259,
        alt: 'Deer suede fringe at the outer leg beside a turquoise-colored embellishment.',
      },
      {
        id: 'hem',
        title: 'Flared hem',
        file: 'ada-hem.webp',
        width: 335,
        height: 434,
        alt: 'Lower legs of the waxed black flares falling over the shoes.',
      },
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
