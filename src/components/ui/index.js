'use client'

export const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    padding: 16, background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, ...style
  }}>{children}</div>
)

export const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', fontWeight: 700, marginBottom: 8 }}>
    {children}
  </div>
)

const PATHS = {
  home:  ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'],
  cal:   ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  bars:  ['M18 20V10','M12 20V4','M6 20v-6'],
  chevL: ['M15 18l-6-6 6-6'],
  chevR: ['M9 18l6-6-6-6'],
  check: ['M20 6L9 17l-5-5'],
  edit:  ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
}

export const Ic = ({ n, sz = 18, style = {} }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {(PATHS[n] || []).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

export const ScoreRing = ({ score, maxScore, size = 104, color }) => {
  const pct = maxScore > 0 ? Math.min(score / maxScore, 1) : 0
  const half = size / 2, r = half - 8, circ = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={half} cy={half} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
        <circle cx={half} cy={half} r={r} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${circ * pct} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.4s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: size * 0.1, color: '#475569', marginTop: 1 }}>/ {maxScore}</div>
      </div>
    </div>
  )
}
