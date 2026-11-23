import { createFileRoute, Link } from '@tanstack/react-router'
import { Study } from '@/components/study'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'deadmodel / Form studies' },
      {
        name: 'description',
        content:
          'An open sketchbook for experiments in line, shape, and repetition. Explore the first deadmodel form study.',
      },
    ],
    links: [{ rel: 'icon', href: `${import.meta.env.BASE_URL}mark.svg`, type: 'image/svg+xml' }],
  }),
})

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-10">
      <header className="folio flex items-center justify-between gap-3 border-b border-foreground py-5">
        <span className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}mark.svg`} width="28" height="28" alt="" />
          Form studies
        </span>
        <Link to="/buyer-sheet" className="text-muted-foreground underline underline-offset-4">
          ADA buyer sheet
        </Link>
      </header>
      <main>
        <div className="pb-9 pt-12 sm:pb-12 sm:pt-16">
          <h1 className="text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-[0.9] tracking-[-0.09em]">
            deadmodel
            <span aria-hidden="true" className="text-[#596a3c]">
              /
            </span>
          </h1>
          <p className="mt-5 text-lg tracking-tight text-muted-foreground sm:text-2xl">
            An open sketchbook for experiments in line and form.
          </p>
        </div>
        <Study />
      </main>
      <footer className="folio flex justify-between gap-3 border-t border-foreground py-5 text-muted-foreground">
        <span>Deadmodel / Index</span>
        <span>End of sheet</span>
      </footer>
    </div>
  )
}
