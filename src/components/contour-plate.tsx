// Closed ellipses follow a curve; using the same coordinates on the server
// and client keeps the printed plate and hydrated page identical.
const contours = Array.from({ length: 51 }, (_, i) => {
  const t = i / 50
  const phase = t * Math.PI * 1.8
  return {
    id: `contour-${i}`,
    x: (245 + 64 * Math.sin(phase - 0.55)).toFixed(2),
    y: (66 + t * 235).toFixed(2),
    angle: (-52 + t * 108).toFixed(2),
    radius: (73 + 26 * Math.cos(phase)).toFixed(2),
  }
})

export function ContourPlate() {
  return (
    <svg viewBox="0 0 480 360" className="w-full" role="img" aria-labelledby="plate-desc">
      <title id="plate-desc">A folded ribbon drawn with fifty-one overlapping lime ellipses</title>
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.85" fill="#555948" />
        </pattern>
      </defs>
      <rect width="480" height="360" fill="url(#grid)" />
      <g fill="none" stroke="#d3ef80" strokeWidth="1.35">
        {contours.map(({ id, x, y, angle, radius }) => (
          <ellipse
            key={id}
            rx={radius}
            ry="42"
            transform={`translate(${x} ${y}) rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  )
}
