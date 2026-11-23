import { createFileRoute } from '@tanstack/react-router'
import { assetUrl } from '@/features/buyer-sheet/ada'
import { BuyerSheet } from '@/features/buyer-sheet/buyer-sheet'
import sheetCss from '@/features/buyer-sheet/sheet.css?url'

export const Route = createFileRoute('/buyer-sheet')({
  head: () => ({
    meta: [
      { title: 'ADA denim buyer sheet — dead model' },
      {
        name: 'description',
        content:
          'Garment photographs, materials, size quantities and retail and wholesale pricing for the ADA low-rise wax black fringe denim.',
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      { rel: 'stylesheet', href: sheetCss },
      { rel: 'icon', href: assetUrl('mark.svg'), type: 'image/svg+xml' },
    ],
  }),
  component: BuyerSheet,
})
