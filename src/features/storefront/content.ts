import { z } from 'zod'
import story from '../../../content/story.json' with { type: 'json' }

const text = z.string().trim().min(1)
export const brandStory = z.object({ heading: text, opening: text, closing: text }).parse(story)

// Pages CMS stores site-root paths. Vite's base includes the repository name on Pages.
export const photoUrl = (image: string) => `${import.meta.env.BASE_URL}${image.slice(1)}`
