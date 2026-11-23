import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'deadmodel / Form studies',
      },
      {
        name: 'description',
        content:
          'An open sketchbook for experiments in line, shape, and repetition. Explore the first deadmodel form study.',
      },
    ],
    links: [
      { rel: 'icon', href: `${import.meta.env.BASE_URL}mark.svg`, type: 'image/svg+xml' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
