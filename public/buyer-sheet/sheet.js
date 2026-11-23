const photographs = [
  {
    key: 'denim',
    title: 'Full length',
    alt: 'Front of the ADA jean on a model, showing black flared legs, side fringe, and turquoise-colored embellishments.',
  },
  {
    key: 'pockets',
    title: 'Pocket detail',
    alt: 'Waist and pocket detail with silver hardware and curved stitched motifs.',
  },
  {
    key: 'fringe',
    title: 'Fringe detail',
    alt: 'Deer suede fringe at the outer leg beside a turquoise-colored embellishment.',
  },
  {
    key: 'hem',
    title: 'Flared hem',
    alt: 'Lower legs of the waxed black flares falling over the shoes.',
  },
]
const thumbnails = [...document.querySelectorAll('.thumbs button')]
const hero = document.getElementById('hero')
const enlarge = document.getElementById('enlarge')
const viewer = document.getElementById('viewer')
const viewerImage = document.getElementById('viewer-image')
let selected = 0

function selectPhotograph(index) {
  selected = (index + photographs.length) % photographs.length
  const photo = photographs[selected]
  const count = String(selected + 1).padStart(2, '0') + ' / 04'
  for (const img of [hero, viewerImage]) {
    img.src = 'assets/ada-' + photo.key + '.webp'
    img.alt = photo.alt
  }
  thumbnails.forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === selected))
  })
  enlarge.setAttribute('aria-label', 'Enlarge ' + photo.title.toLowerCase() + ' photograph')
  document.getElementById('view-count').textContent = count
  document.getElementById('viewer-title').textContent = 'ADA / ' + photo.title
  document.getElementById('viewer-count').textContent = count
}
thumbnails.forEach((button, index) => {
  button.addEventListener('click', () => selectPhotograph(index))
})
enlarge.addEventListener('click', () => {
  selectPhotograph(selected)
  viewer.showModal()
  document.getElementById('close').focus()
})
document.getElementById('previous').addEventListener('click', () => selectPhotograph(selected - 1))
document.getElementById('next').addEventListener('click', () => selectPhotograph(selected + 1))
document.getElementById('close').addEventListener('click', () => viewer.close())
viewer.addEventListener('close', () => enlarge.focus({ preventScroll: true }))
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') selectPhotograph(selected - 1)
  if (event.key === 'ArrowRight') selectPhotograph(selected + 1)
})
viewer.addEventListener('click', (event) => {
  if (event.target !== viewer) return
  const box = viewer.getBoundingClientRect()
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    viewer.close()
})

document.getElementById('print').addEventListener('click', () => window.print())
let viewBeforePrint = 0
window.addEventListener('beforeprint', () => {
  viewBeforePrint = selected
  selectPhotograph(0)
})
window.addEventListener('afterprint', () => selectPhotograph(viewBeforePrint))

const sectionLinks = [...document.querySelectorAll('nav a')]
const notes = document.getElementById('notes')
function updateNavigation() {
  const atBottom =
    window.scrollY > 0 &&
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  const active =
    notes.getBoundingClientRect().top < window.innerHeight * 0.48 || atBottom ? '#notes' : '#sheet'
  for (const link of sectionLinks) {
    if (link.hash === active) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  }
}
window.addEventListener('scroll', updateNavigation, { passive: true })
window.addEventListener('resize', updateNavigation)
updateNavigation()
