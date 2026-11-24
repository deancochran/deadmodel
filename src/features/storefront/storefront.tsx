import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ada, assetUrl } from './ada'
import { Gallery } from './gallery'
import { OrderForm } from './order-form'

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <a href="#top" aria-label="dead model — back to top">
      <img
        src={assetUrl('dead-model-wordmark.png')}
        alt="dead model"
        width="446"
        height="67"
        className={small ? 'w-[105px]' : 'ada-wordmark'}
      />
    </a>
  )
}

export function Storefront() {
  const notes = useRef<HTMLElement>(null)
  const [atNotes, setAtNotes] = useState(false)
  const [canPrint, setCanPrint] = useState(false)
  useEffect(() => {
    setCanPrint(true)
    const sync = () => {
      const el = notes.current
      if (!el) return
      const bottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      setAtNotes(bottom || el.getBoundingClientRect().top < window.innerHeight * 0.48)
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])
  return (
    <div id="top" className="ada-sheet">
      <a className="ada-skip" href="#shop">
        Skip to product
      </a>
      <div className="ada-wrap">
        <header className="ada-masthead">
          <Wordmark />
          <nav aria-label="Page navigation" className="flex items-center">
            <a href="#shop" aria-current={!atNotes ? 'location' : undefined}>
              Shop
            </a>
            <a href="#notes" aria-current={atNotes ? 'location' : undefined}>
              Brand notes
            </a>
            <Button
              type="button"
              variant="outline"
              disabled={!canPrint}
              className="ada-print"
              onClick={() => window.print()}
              aria-label="Print details"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M5.5 6.5V2h9v4.5m0 7.5H18V7H2v7h3.5M5.5 11h9v7h-9zM14.7 9H16" />
              </svg>
              <span>Print details</span>
            </Button>
          </nav>
        </header>
        <main>
          <section id="shop" tabIndex={-1} aria-labelledby="ada-title" className="ada-product">
            <h1 id="ada-title">
              {ada.title} <span className="whitespace-nowrap">({ada.weight})</span>
            </h1>
            <Gallery />
            <p className="ada-intro">{ada.description}</p>
            <OrderForm />
          </section>
          <section ref={notes} className="ada-notes" id="notes" aria-labelledby="ada-notes-title">
            <h2 id="ada-notes-title">Brand notes</h2>
            <div className="ada-notes-grid">
              <div className="ada-story">
                <h3>Broadway, after curtain call.</h3>
                <p>
                  The lashes stay on. Somebody at the stage door knows where the party is. dead
                  model takes its cue from the divas who carry a little of the show out into the
                  street.
                </p>
                <p>
                  The ADA sits low and moves with you. Its wax catches the light, the fringe swings
                  with the beat, and the dance floor is yours. You take the stage.
                </p>
              </div>
              <figure
                className="ada-cards"
                aria-label="Front and reverse of the dead model print card"
              >
                <img
                  width="478"
                  height="620"
                  loading="lazy"
                  src={assetUrl('fringe-poster.webp')}
                  alt="Front of the print card: a black ink silhouette of fringed denim."
                />
                <img
                  width="478"
                  height="620"
                  loading="lazy"
                  src={assetUrl('signature-card.webp')}
                  alt="Reverse of the print card, with the dead model wordmark and handwritten signature."
                />
              </figure>
            </div>
          </section>
        </main>
        <footer className="ada-footer flex items-center justify-between gap-3">
          <Wordmark small />
          <a className="underline underline-offset-4" href="#shop">
            Back to shop
          </a>
        </footer>
      </div>
    </div>
  )
}
