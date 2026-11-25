import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ada, printHero } from './ada'
import { photoUrl } from './content'
import './gallery.css'

const formatCount = (index: number) =>
  `${String(index + 1).padStart(2, '0')} / ${String(ada.photos.length).padStart(2, '0')}`

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const selectedPhoto = ada.photos[selectedIndex] ?? ada.photos[0]
  const hasMultiplePhotos = ada.photos.length > 1

  function selectPhoto(index: number) {
    setSelectedIndex((index + ada.photos.length) % ada.photos.length)
  }

  return (
    <section className="ada-gallery" aria-label={`${ada.shortTitle} gallery`}>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="ada-gallery__hero"
            disabled={!ready}
            type="button"
            aria-label={`Enlarge ${ada.shortTitle}: ${selectedPhoto.title.toLowerCase()} photograph`}
          >
            <img src={photoUrl(selectedPhoto.image)} alt={selectedPhoto.alt} fetchPriority="high" />
            <span className="ada-gallery__expand" aria-hidden="true">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M7.5 3H3v4.5M12.5 3H17v4.5M3 12.5V17h4.5M17 12.5V17h-4.5" />
              </svg>
            </span>
          </button>
        </DialogTrigger>

        <DialogContent
          className="ada-dialog ada-gallery__lightbox"
          onKeyDown={(event) => {
            if (hasMultiplePhotos && event.key === 'ArrowLeft') {
              event.preventDefault()
              selectPhoto(selectedIndex - 1)
            }
            if (hasMultiplePhotos && event.key === 'ArrowRight') {
              event.preventDefault()
              selectPhoto(selectedIndex + 1)
            }
          }}
        >
          <header className="ada-gallery__lightbox-header">
            <DialogTitle className="text-sm font-normal">
              {ada.shortTitle} / {selectedPhoto.title}
            </DialogTitle>
            <DialogClose className="ada-gallery__lightbox-button" aria-label="Close photograph">
              Close <span aria-hidden="true">×</span>
            </DialogClose>
          </header>
          <DialogDescription className="sr-only">
            Enlarged {ada.shortTitle} photograph.
          </DialogDescription>
          <img
            className="ada-gallery__lightbox-image"
            src={photoUrl(selectedPhoto.image)}
            alt={selectedPhoto.alt}
          />
          {hasMultiplePhotos && (
            <footer className="ada-gallery__lightbox-footer">
              <button
                className="ada-gallery__lightbox-button"
                aria-label="Previous photograph"
                type="button"
                onClick={() => selectPhoto(selectedIndex - 1)}
              >
                Previous
              </button>
              <span aria-live="polite">{formatCount(selectedIndex)}</span>
              <button
                className="ada-gallery__lightbox-button"
                aria-label="Next photograph"
                type="button"
                onClick={() => selectPhoto(selectedIndex + 1)}
              >
                Next
              </button>
            </footer>
          )}
        </DialogContent>
      </Dialog>

      {hasMultiplePhotos && (
        <div className="ada-gallery__bottom">
          <fieldset className="ada-gallery__thumbs">
            <legend className="sr-only">Select garment photograph</legend>
            {ada.photos.map((photo, index) => (
              <button
                key={photo.image}
                type="button"
                disabled={!ready}
                aria-label={`Show ${ada.shortTitle}: ${photo.title.toLowerCase()}`}
                aria-pressed={index === selectedIndex}
                onClick={() => selectPhoto(index)}
              >
                <img src={photoUrl(photo.image)} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
              </button>
            ))}
          </fieldset>
          <span className="ada-gallery__count" aria-live="polite">
            {formatCount(selectedIndex)}
          </span>
        </div>
      )}
      <noscript>
        <p className="text-sm print:hidden">
          View photographs:{' '}
          {ada.photos.map((photo) => (
            <a className="mr-3 underline" key={photo.image} href={photoUrl(photo.image)}>
              {photo.title}
            </a>
          ))}
        </p>
      </noscript>

      <img
        className="ada-gallery__print-hero"
        src={photoUrl(printHero.image)}
        alt={printHero.alt}
      />
    </section>
  )
}
