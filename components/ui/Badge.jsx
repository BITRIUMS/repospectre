const VARIANTS = {
  success: { bg: '#3fb95018', color: '#3fb950', border: '#3fb95038' },
  warning: { bg: '#d2992218', color: '#d29922', border: '#d2992238' },
  danger:  { bg: '#f8514918', color: '#f85149', border: '#f8514938' },
  info:    { bg: '#58a6ff18', color: '#58a6ff', border: '#58a6ff38' },
  purple:  { bg: '#a371f718', color: '#a371f7', border: '#a371f738' },
  default: { bg: '#21262d',   color: '#8b949e', border: '#30363d'   },
}

export default function Badge({ text, variant = 'default', style = {} }) {
  const c = VARIANTS[variant] || VARIANTS.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 4,
      fontSize: '0.6rem', letterSpacing: '0.1em', fontWeight: 700,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      ...style,
    }}>
      {text}
    </span>
  )
}

export function riskVariant(level) {
  const m = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' }
  return m[level?.toLowerCase()] || 'default'
}

export function severityVariant(sev) {
  const m = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info', info: 'default' }
  return m[sev?.toLowerCase()] || 'default'
}
