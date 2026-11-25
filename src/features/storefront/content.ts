import { z } from 'zod'
import brand from '../../../content/brand.json' with { type: 'json' }
import story from '../../../content/story.json' with { type: 'json' }

const text = z.string().trim().min(1)
export const assetPath = (root: string) =>
  z.string().refine(
    (value) =>
      value.startsWith(root) &&
      value
        .slice(root.length)
        .split('/')
        .every((part) => /^[\w-][\w.-]*$/.test(part)) &&
      /\.(?:png|jpe?g|webp|avif)$/i.test(value),
    `Choose a web image from the ${root} library.`,
  )

const identityAsset = assetPath('/brand/identity/')
const editorialAsset = assetPath('/brand/editorial/')

export const siteBrand = z
  .object({
    name: text,
    wordmark: z.object({ image: identityAsset, alt: text }),
    favicon: identityAsset.refine((value) => /\.png$/i.test(value), 'Expected a PNG favicon'),
    pageTitle: text,
    pageDescription: text,
  })
  .parse(brand)

const editorialImage = z.object({ image: editorialAsset, alt: text })

export const brandStory = z
  .object({
    heading: text,
    opening: text,
    closing: text,
    sectionTitle: text,
    front: editorialImage,
    back: editorialImage,
  })
  .parse(story)

// Pages CMS stores site-root paths. Vite's base includes the repository name on Pages.
export const photoUrl = (image: string) => `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`
