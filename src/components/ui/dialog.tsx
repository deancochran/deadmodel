import { cn } from 'cn'
import { Dialog as Primitive } from 'radix-ui'
import type { ComponentProps } from 'react'

export const Dialog = Primitive.Root
export const DialogTrigger = Primitive.Trigger
export const DialogClose = Primitive.Close
export const DialogTitle = Primitive.Title
export const DialogDescription = Primitive.Description

export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-40 bg-black/40 print:hidden"
      />
      <Primitive.Content
        {...props}
        data-slot="dialog-content"
        className={cn(
          'fixed z-50 overflow-y-auto overscroll-contain border border-black bg-white text-black print:hidden',
          className,
        )}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  )
}
