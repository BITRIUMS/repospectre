import { useState, useEffect } from 'react'

export default function Card({ title, icon, color, children, delay = 0 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{
      background: '#161b22',
      border: `1px solid ${color}30`,
      borderRadius: 8,
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s',
      boxShadow: visible ? `0 0 28px ${color}12` : 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 17px',
        borderBottom: `1px solid ${color}20`,
        background: `${color}08`,
      }}>
        <span style={{ fontSize: '0.9rem', filter: `drop-shadow(0 0 4px ${color})` }}>{icon}</span>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '0.64rem', fontWeight: 700,
          letterSpacing: '0.15em', color,
        }}>{title}</span>
      </div>
      <div style={{ padding: '17px' }}>{children}</div>
    </div>
  )
}

export function DataRow({ label, value, valueColor }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '7px 0',
      borderBottom: '1px solid #21262d',
    }}>
      <span style={{ fontSize: '0.66rem', color: '#8b949e' }}>{label}</span>
      <span style={{ fontSize: '0.68rem', color: valueColor || '#e6edf3', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
