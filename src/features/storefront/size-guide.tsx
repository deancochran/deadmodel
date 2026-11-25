import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import guide from '../../../content/size-guide.json' with { type: 'json' }
import { ada } from './ada'

const text = z.string().trim().min(1).max(500)
const measurement = z.object({
  point: z.string().trim().max(12).nullish(),
  label: z.string().trim().min(1).max(120),
  note: z.string().trim().max(500).nullish(),
  inches: z.number().finite().positive(),
})

export const sizeGuideSchema = z.object({
  description: text,
  measurements: z
    .array(measurement)
    .min(1)
    .max(16)
    .refine(
      (measurements) =>
        new Set(measurements.map((item) => item.label)).size === measurements.length,
      'Each measurement needs a unique label.',
    ),
})

const sizeGuide = sizeGuideSchema.parse(guide)

export function SizeGuide({ disabled }: { disabled: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="link"
          size="sm"
          className="col-span-full justify-self-end rounded-none px-1 underline underline-offset-4 print:hidden"
        >
          Size guide
        </Button>
      </DialogTrigger>
      <DialogContent className="ada-dialog inset-y-0 right-0 w-full max-w-[26rem] motion-safe:data-[state=open]:animate-[ada-guide-in_160ms_ease-out]">
        <header className="sticky top-0 flex items-center justify-between border-b border-black bg-white px-5 py-3">
          <DialogTitle className="text-lg font-semibold">Size guide</DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none border-black"
              aria-label="Close size guide"
            >
              Close
            </Button>
          </DialogClose>
        </header>
        <div className="px-5 py-6">
          <h3 className="text-2xl font-medium tracking-tight">{ada.shortTitle} · Size Small</h3>
          <DialogDescription className="my-3 text-sm leading-relaxed">
            {sizeGuide.description}
          </DialogDescription>
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              {ada.shortTitle} size Small sample measurements in inches
            </caption>
            <thead className="border-y border-black font-mono text-xs uppercase">
              <tr>
                <th scope="col" className="py-2">
                  Measurement
                </th>
                <th scope="col" className="text-right">
                  Inches
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.measurements.map(({ point, label, note, inches }) => (
                <tr key={label} className="border-b border-black/20">
                  <th scope="row" className="py-2 font-normal">
                    {point && (
                      <span className="mr-3 font-mono text-xs text-neutral-600">{point}</span>
                    )}
                    {label}
                    {note && <span className="block pl-5 text-xs text-neutral-600">{note}</span>}
                  </th>
                  <td className="text-right font-mono tabular-nums">{inches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
