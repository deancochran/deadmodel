import { createFileRoute } from '@tanstack/react-router'
import { photoUrl, siteBrand } from '@/features/storefront/content'
import { Storefront } from '@/features/storefront/storefront'
import shopCss from '@/features/storefront/storefront.css?url'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: siteBrand.pageTitle },
      {
        name: 'description',
        content: siteBrand.pageDescription,
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      { rel: 'stylesheet', href: shopCss },
      { rel: 'icon', href: photoUrl(siteBrand.favicon), type: 'image/png' },
    ],
  }),
  component: Storefront,
})
