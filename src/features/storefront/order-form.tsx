import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { ada, assetUrl, printHero, type Size, sizes, tierLabel, tiers } from './ada'
import {
  blankOrder,
  formatCents,
  type OrderValues,
  orderMessage,
  orderSchema,
  quoteOrder,
  type ValidOrder,
} from './order'
import { SizeGuide } from './size-guide'
import './order.css'

export function OrderForm() {
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const editSize = useRef<Size | null>(null)
  const buyButton = useRef<HTMLButtonElement | null>(null)
  const sizeInputs = useRef<Partial<Record<Size, HTMLInputElement | null>>>({})
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderValues, unknown, ValidOrder>({
    defaultValues: blankOrder,
    resolver: zodResolver(orderSchema),
  })
  useEffect(() => setHydrated(true), [])

  const values = watch()
  const quote = quoteOrder(values)
  const selectedSize = quote?.lines[0]?.size ?? sizes[0]
  const fieldErrors = sizes.flatMap((size) => {
    const message = errors.quantities?.[size]?.message
    if (!message || (message === orderMessage && quote?.lines.length)) return []
    return [{ size, message }]
  })

  function previewOrder() {
    setOpen(true)
  }

  function editOrder() {
    editSize.current = selectedSize
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        className="ada-order-form"
        aria-label="ADA denim order preview"
        noValidate
        onSubmit={handleSubmit(previewOrder)}
      >
        <div className="ada-order-strip">
          <fieldset disabled={!hydrated} className="ada-order-tiers">
            <legend className="ada-order-sr-only">Buyer type</legend>
            {tiers.map((tier) => (
              <label key={tier}>
                <input
                  defaultChecked={tier === blankOrder.tier}
                  type="radio"
                  value={tier}
                  {...register('tier')}
                />
                <span>{tierLabel[tier]}</span>
              </label>
            ))}
          </fieldset>
          <output className="ada-order-unit-price" aria-live="polite">
            {formatCents(ada.prices[values.tier])} / pair
          </output>
        </div>

        <div className="ada-order-block">
          <dl className="ada-order-specs">
            <div>
              <dt>Style</dt>
              <dd>
                {ada.style.map((style, index) => (
                  <span key={style}>
                    {style}
                    {index < ada.style.length - 1 && <br />}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{ada.color}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>
                {ada.materials.map((material, index) => (
                  <span key={material}>
                    {material}
                    {index < ada.materials.length - 1 && <br />}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>
                Wholesale {formatCents(ada.prices.boutique)}
                <br />
                RRP {formatCents(ada.prices.individual)}
              </dd>
            </div>
          </dl>

          <table className="ada-order-sizes">
            <caption className="ada-order-sr-only">Purchase quantities by size</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Qty</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => {
                const input = register(`quantities.${size}`)
                const invalid = fieldErrors.some((field) => field.size === size)
                return (
                  <tr key={size}>
                    <th scope="row">{size}</th>
                    <td>
                      <input
                        {...input}
                        ref={(element) => {
                          input.ref(element)
                          sizeInputs.current[size] = element
                        }}
                        aria-describedby={invalid ? `quantity-${size}-error` : undefined}
                        aria-invalid={invalid}
                        disabled={!hydrated}
                        aria-label={`${size} quantity`}
                        autoComplete="off"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        type="text"
                      />
                      <output className="ada-order-print-quantity">
                        {quote?.lines.find((line) => line.size === size)?.quantity ?? ''}
                      </output>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <SizeGuide disabled={!hydrated} />
        </div>
        {fieldErrors.length > 0 && (
          <div className="ada-order-preview-notice" role="alert">
            {fieldErrors.map(({ size, message }) => (
              <p key={size} id={`quantity-${size}-error`}>
                {message === orderMessage ? message : `${size}: ${message}`}
              </p>
            ))}
          </div>
        )}

        <div className="ada-order-purchase">
          <div className="ada-order-total">
            <span>Subtotal</span>
            <output aria-live="polite">{quote ? formatCents(quote.subtotalCents) : '—'}</output>
          </div>
          <button
            ref={buyButton}
            aria-describedby="ada-order-preview-notice"
            aria-haspopup="dialog"
            className="ada-order-buy"
            disabled={!hydrated}
            type="submit"
          >
            Buy now
          </button>
        </div>
        <p id="ada-order-preview-notice" className="ada-order-preview-notice">
          Preview only. No payment is collected.
        </p>
        {!hydrated && (
          <p className="ada-order-hydration" aria-live="polite">
            Enable JavaScript to enter quantities and preview an order.
          </p>
        )}
      </form>

      <DialogContent
        className="ada-dialog ada-order-dialog"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (editSize.current) {
            sizeInputs.current[editSize.current]?.focus()
          } else {
            buyButton.current?.focus()
          }
          editSize.current = null
        }}
      >
        <header className="ada-order-dialog-head">
          <DialogTitle>Order preview</DialogTitle>
          <DialogClose className="ada-order-close" aria-label="Cancel order preview">
            ×
          </DialogClose>
        </header>
        <div className="ada-order-dialog-content">
          <DialogDescription>
            Preview only. No payment is collected and this does not place an order.
          </DialogDescription>
          <section aria-label="Order review">
            <div className="ada-order-product">
              <img
                src={assetUrl(printHero.file)}
                alt=""
                width={printHero.width}
                height={printHero.height}
              />
              <div>
                <p>{quote?.tierLabel}</p>
                <h3>{ada.shortTitle}</h3>
                <p>
                  {ada.color} · {quote ? `${formatCents(quote.unitPriceCents)} / pair` : '—'}
                </p>
              </div>
            </div>
            <table className="ada-order-lines">
              <caption className="ada-order-sr-only">Selected quantities and amounts</caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote?.lines.map((line) => (
                  <tr key={line.size}>
                    <th scope="row">{line.size}</th>
                    <td>{line.quantity}</td>
                    <td>{formatCents(line.amountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ada-order-review-total">
              <span>Subtotal</span>
              <strong>{quote ? formatCents(quote.subtotalCents) : '—'}</strong>
            </div>
            <button className="ada-order-edit" type="button" onClick={editOrder}>
              Edit quantities
            </button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
