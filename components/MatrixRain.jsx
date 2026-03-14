import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const CHARS = '01アイウエオカキクケコREPOSPECTREGITHUBSECDLLHERMES▲◈⬡◉'
    const FS = 12
    let cols, drops, frame = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / FS)
      drops = Array(cols).fill(1)
    }
    resize()

    const draw = () => {
      if (frame++ % 3 !== 0) { requestAnimationFrame(draw); return }
      ctx.fillStyle = 'rgba(13,17,23,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(63,185,80,0.14)'
      ctx.font = `${FS}px "JetBrains Mono", monospace`
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(ch, i * FS, y * FS)
        if (y * FS > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
      requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 0,
        opacity: 0.38, pointerEvents: 'none',
      }}
    />
  )
}
