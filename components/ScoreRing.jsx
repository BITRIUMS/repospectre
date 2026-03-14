import { useState, useEffect } from 'react'

export default function ScoreRing({ score = 0, color = '#3fb950', label = '', size = 80 }) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    setAnimated(0)
    const t = setTimeout(() => {
      let cur = 0
      const iv = setInterval(() => {
        cur = Math.min(cur + 2, score)
        setAnimated(cur)
        if (cur >= score) clearInterval(iv)
      }, 16)
      return () => clearInterval(iv)
    }, 350)
    return () => clearTimeout(t)
  }, [score])

  const dashLen = (animated / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#21262d" strokeWidth={6}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${dashLen} ${circumference}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.08s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: "'Orbitron', monospace",
          fontSize: '1rem', fontWeight: 700,
          color, textAlign: 'center', lineHeight: 1,
        }}>
          {animated}
        </div>
      </div>
      <span style={{
        fontSize: '0.58rem', letterSpacing: '0.12em',
        color: '#8b949e', textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  )
}
