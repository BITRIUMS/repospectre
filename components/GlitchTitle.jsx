import { useState, useEffect } from 'react'

export default function GlitchTitle() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const tick = () => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 180)
    }
    const id = setInterval(tick, 3000 + Math.random() * 2500)
    return () => clearInterval(id)
  }, [])

  const baseStyle = {
    fontFamily: "'Orbitron', monospace",
    fontSize: 'clamp(2.4rem, 6vw, 5rem)',
    fontWeight: 900,
    letterSpacing: '0.15em',
    color: '#e6edf3',
    textTransform: 'uppercase',
    position: 'relative',
    userSelect: 'none',
    margin: 0,
    animation: glitch ? 'glitch 0.18s steps(2) infinite' : 'none',
  }

  const ghostBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    fontFamily: "'Orbitron', monospace",
    fontSize: 'clamp(2.4rem, 6vw, 5rem)',
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    margin: 0,
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h1 style={baseStyle}>
        <span style={{ color: '#3fb950' }}>REPO</span>SPECTRE
      </h1>
      {glitch && (
        <>
          <h1 style={{
            ...ghostBase,
            color: '#f85149',
            clipPath: 'polygon(0 25%, 100% 25%, 100% 48%, 0 48%)',
            transform: 'translate(-3px, -3px)',
            opacity: 0.75,
          }}>
            REPOSPECTRE
          </h1>
          <h1 style={{
            ...ghostBase,
            color: '#58a6ff',
            clipPath: 'polygon(0 62%, 100% 62%, 100% 84%, 0 84%)',
            transform: 'translate(3px, 3px)',
            opacity: 0.75,
          }}>
            REPOSPECTRE
          </h1>
        </>
      )}
    </div>
  )
}
