import { createFileRoute } from '@tanstack/react-router'
import { assetUrl } from '@/features/storefront/ada'
import { Storefront } from '@/features/storefront/storefront'
import shopCss from '@/features/storefront/storefront.css?url'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'dead model — ADA fringe denim' },
      {
        name: 'description',
        content:
          'Explore the ADA low-rise wax black fringe denim by dead model. See the fit, choose sizes and preview a retail or wholesale order.',
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      { rel: 'stylesheet', href: shopCss },
      { rel: 'icon', href: assetUrl('mark.svg'), type: 'image/svg+xml' },
    ],
  }),
  component: Storefront,
})
