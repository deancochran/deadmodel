import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ContourPlate } from './contour-plate'

const initialCaption = 'Fold sequence'
const captionSchema = z.object({
  caption: z
    .string()
    .trim()
    .min(1, 'Enter a caption first.')
    .max(48, 'Use 48 characters or fewer.'),
})

export function Study() {
  const [caption, setCaption] = useState(initialCaption)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof captionSchema>>({
    resolver: zodResolver(captionSchema),
    defaultValues: { caption: initialCaption },
  })

  return (
    <section
      aria-labelledby="study-title"
      className="grid items-center gap-x-16 gap-y-8 border-t border-foreground py-8 md:grid-cols-[minmax(0,0.83fr)_minmax(0,1.17fr)] md:py-12"
    >
      <div>
        <p className="folio text-muted-foreground">Study 001 / Geometry</p>
        <h2 id="study-title" className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
          Fold sequence
        </h2>
        <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
          One ellipse, drawn fifty-one times. Each line shifts a little further until a flat shape
          starts to fold.
        </p>
        <form
          className="mt-8 max-w-sm border-t border-border pt-5"
          noValidate
          onSubmit={handleSubmit(({ caption: value }) => setCaption(value))}
        >
          <fieldset disabled={!ready}>
            <Label htmlFor="caption">Plate caption</Label>
            <div className="my-2 flex flex-wrap gap-2">
              <Input
                id="caption"
                className="h-11 min-w-40 flex-1 rounded-sm"
                aria-invalid={Boolean(errors.caption)}
                aria-describedby={errors.caption ? 'caption-hint caption-error' : 'caption-hint'}
                {...register('caption')}
              />
              <Button type="submit" disabled={!ready} className="h-11 rounded-sm">
                Apply caption
              </Button>
            </div>
            <p id="caption-hint" className="text-sm text-muted-foreground">
              {ready
                ? 'Try a new title. It only changes this preview.'
                : 'Enable JavaScript to edit the caption.'}
            </p>
            {errors.caption && (
              <p id="caption-error" role="alert" className="mt-2 text-sm text-destructive">
                {errors.caption.message}
              </p>
            )}
          </fieldset>
        </form>
      </div>
      <figure className="min-w-0 overflow-hidden rounded-sm bg-foreground text-background">
        <div className="folio flex justify-between p-5 text-accent">
          <span>DM—001</span>
          <span>Fig. A</span>
        </div>
        <ContourPlate />
        <figcaption className="mx-5 flex items-baseline justify-between gap-3 border-t border-[#63665a] py-4">
          <span
            aria-live="polite"
            aria-atomic="true"
            className="min-w-0 text-xl tracking-tight [overflow-wrap:anywhere]"
          >
            {caption}
          </span>
          <span className="folio shrink-0 text-accent">01 / 01</span>
        </figcaption>
      </figure>
    </section>
  )
}
