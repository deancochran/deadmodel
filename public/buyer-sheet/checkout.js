const orderForm = document.getElementById('buyer-form')
const quantities = [...orderForm.querySelectorAll('input[data-size]')]
const errorMessage = document.getElementById('quantity-error')
const checkout = document.getElementById('checkout')
const checkoutTitle = document.getElementById('checkout-heading')
const orderReview = document.getElementById('order-review')
const giftPreview = document.getElementById('gift-preview')
const giftForm = document.getElementById('gift-form')
const giftResult = document.getElementById('gift-result')
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function readOrder() {
  const buyer = orderForm.querySelector('input[name="buyer"]:checked')
  const price = Number(buyer.dataset.unit)
  const items = quantities
    .filter((input) => input.validity.valid && Number(input.value) > 0)
    .map((input) => ({ size: input.dataset.size, quantity: Number(input.value) }))
  const subtotal = items.reduce((total, item) => total + item.quantity * price, 0)
  return { buyer: buyer.value, price, items, subtotal }
}

function updateSheet() {
  const order = readOrder()
  document.getElementById('unit-price').textContent = money.format(order.price) + ' / pair'
  document.getElementById('sheet-subtotal').value = money.format(order.subtotal)
  errorMessage.hidden = true
  quantities.forEach((input) => {
    input.removeAttribute('aria-invalid')
    input.removeAttribute('aria-describedby')
  })
}

function flagQuantity(input, message) {
  errorMessage.textContent = message
  errorMessage.hidden = false
  input.setAttribute('aria-invalid', 'true')
  input.setAttribute('aria-describedby', 'quantity-error')
  input.focus()
}

orderForm.addEventListener('input', updateSheet)
window.addEventListener('pageshow', updateSheet)
orderForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const invalid = quantities.find((input) => !input.validity.valid)
  if (invalid) {
    flagQuantity(invalid, 'Use a whole number of zero or more for each size.')
    return
  }
  const order = readOrder()
  if (!order.items.length) {
    flagQuantity(quantities[0], 'Enter a quantity for at least one size.')
    return
  }
  const rows = order.items.map((item) => {
    const row = document.createElement('tr')
    const size = document.createElement('th')
    size.scope = 'row'
    size.textContent = item.size
    row.append(size)
    row.insertCell().textContent = item.quantity
    row.insertCell().textContent = money.format(item.quantity * order.price)
    return row
  })
  document.getElementById('review-lines').replaceChildren(...rows)
  document.getElementById('review-buyer').textContent =
    order.buyer === 'boutique' ? 'Wholesale boutique' : 'Individual order'
  document.getElementById('review-price').textContent =
    'Waxed black · ' + money.format(order.price) + ' / pair'
  document.getElementById('review-subtotal').textContent = money.format(order.subtotal)
  orderReview.hidden = false
  giftPreview.hidden = true
  checkoutTitle.textContent = 'Checkout preview'
  checkout.showModal()
  checkoutTitle.focus({ preventScroll: true })
})

document.getElementById('close-checkout').addEventListener('click', () => checkout.close())
document.getElementById('edit-order').addEventListener('click', () => {
  checkout.close()
  ;(quantities.find((input) => Number(input.value) > 0) || quantities[0]).focus()
})

document.getElementById('complete-preview').addEventListener('click', () => {
  if (readOrder().buyer === 'boutique') {
    checkout.close()
    document.getElementById('campaign-status').hidden = false
    const heading = document.getElementById('campaign-heading')
    heading.focus({ preventScroll: true })
    document.getElementById('campaign').scrollIntoView({ block: 'center' })
    return
  }
  orderReview.hidden = true
  giftPreview.hidden = false
  giftForm.hidden = false
  giftForm.reset()
  giftResult.hidden = true
  checkoutTitle.textContent = 'Early buyer gift preview'
  checkoutTitle.focus({ preventScroll: true })
})

giftForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const shirt = document.getElementById('sample-shirt').value
  giftResult.textContent = shirt + ' selected for this preview.'
  giftResult.hidden = false
  giftForm.hidden = true
  document.getElementById('finish-gift').focus()
})
document.getElementById('finish-gift').addEventListener('click', () => checkout.close())

checkout.addEventListener('click', (event) => {
  if (event.target !== checkout) return
  const bounds = checkout.getBoundingClientRect()
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    checkout.close()
})
updateSheet()
