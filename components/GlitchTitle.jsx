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

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h1 className={`title-main ${glitch ? 'glitching' : ''}`}>
        <span className="title-accent">REPO</span>SPECTRE
      </h1>
      {glitch && (
        <>
          <span className="title-ghost ghost-red">REPOSPECTRE</span>
          <span className="title-ghost ghost-blue">REPOSPECTRE</span>
        </>
      )}
      <style jsx>{`
        .title-main {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.4rem, 6vw, 5rem);
          font-weight: 900;
          letter-spacing: 0.15em;
          color: #e6edf3;
          text-transform: uppercase;
          position: relative;
          user-select:
