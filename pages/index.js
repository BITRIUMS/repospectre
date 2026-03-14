import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import GlitchTitle from '../components/GlitchTitle'
import ScanProgress, { STAGES } from '../components/ScanProgress'
import ResultGrid from '../components/ResultGrid'

const MatrixRain = dynamic(() => import('../components/MatrixRain'), { ssr: false })

function useTypewriter(text, delay = 0, speed = 36) {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setOutput(''); setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        setOutput(text.slice(0, ++i))
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed])
  return { output, done }
}

function TypewriterLine({ text, delay, speed, color, fontSize, letterSpacing }) {
  const { output, done } = useTypewriter(text, delay, speed)
  return (
    <span style={{ color: color || '#58a6ff', fontSize, letterSpacing }}>
      {output}
      {!done && <span style={{ animation: 'blink 0.8s step-end infinite' }}>▮</span>}
    </span>
  )
}

function TermLine({ text, color = '#484f58', prefix = '>', delay = 0 }) {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: vis ? color : 'transparent', transition: 'color 0.2s', lineHeight: 1.6 }}>
      <span style={{ color: '#3fb950', marginRight: 8 }}>{prefix}</span>{text}
    </div>
  )
}

// JS-driven fade — avoids CSS @keyframes opacity:0 trap in production
function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatBox({ label, value, accent = false }) {
  return (
    <div style={{ padding: '14px 10px', background: '#161b22', border: `1px solid ${accent ? '#3fb95030' : '#21262d'}`, textAlign: 'center' }}>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.95rem', fontWeight: 700, color: accent ? '#3fb950' : '#e6edf3', letterSpacing: '0.05em' }}>{value}</div>
      <div style={{ fontSize: '0.52rem', color: '#484f58', letterSpacing: '0.15em', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function HexGrid() {
  return (
    <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, opacity: 0.06, pointerEvents: 'none' }}>
      {Array(24).fill(0).map((_, i) => (
        <div key={i} style={{ width: 14, height: 14, background: i % 3 === 0 ? '#3fb950' : '#58a6ff', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      ))}
    </div>
  )
}

function QuickBtn({ repo, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={() => onClick(repo)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '6px 13px', background: hov ? '#21262d' : '#161b22', border: `1px solid ${hov ? '#58a6ff' : '#30363d'}`, borderRadius: 4, cursor: 'pointer', color: hov ? '#58a6ff' : '#8b949e', fontSize: '0.62rem', fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.18s' }}>
      {repo}
    </button>
  )
}

const TICKER_MSGS = [
  'AGENT ONLINE — AWAITING TARGET COORDINATES',
  'HERMES-4-70B NEURAL CORE LOADED',
  'GITHUB RECON MODULE STANDBY',
  'DLL DETECTION ENGINE ARMED',
  'SECURITY AUDIT SUBSYSTEM READY',
  'DEPENDENCY SCANNER INITIALIZED',
]

function StatusTicker() {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(i => (i + 1) % TICKER_MSGS.length); setVis(true) }, 300)
    }, 3500)
    return () => clearInterval(iv)
  }, [])
  return (
    <div style={{ fontSize: '0.6rem', color: '#3fb950', letterSpacing: '0.15em', fontWeight: 700, opacity: vis ? 1 : 0, transition: 'opacity 0.3s', height: 18 }}>
      {TICKER_MSGS[idx]}
    </div>
  )
}

function ScanButton({ loading, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={loading}
      onMouseEnter={() => !loading && setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '14px',
        background: loading ? '#21262d' : hov ? 'linear-gradient(135deg,#3fb950,#2ea043,#3fb950)' : 'linear-gradient(135deg,#3fb950,#2ea043)',
        border: loading ? '1px solid #30363d' : `1px solid ${hov ? '#3fb950' : '#3fb95080'}`,
        borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
        color: loading ? '#484f58' : '#0d1117',
        fontFamily: "'Orbitron', monospace", fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.22em',
        transition: 'all 0.2s',
        boxShadow: loading ? 'none' : hov ? '0 0 32px #3fb95050' : '0 0 20px #3fb95028',
        transform: hov && !loading ? 'translateY(-1px)' : 'none',
      }}>
      {loading
        ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>◈</span>
            AGENT SCANNING — DO NOT INTERRUPT
          </span>
        : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span>▶</span> INITIATE DEEP SCAN
          </span>
      }
    </button>
  )
}

function InputField({ label, hint, prefix, value, onChange, onKeyDown, placeholder }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: '0.6rem', color: '#8b949e', letterSpacing: '0.15em', marginBottom: 6 }}>
        {label}{hint && <span style={{ color: '#484f58', marginLeft: 6, fontSize: '0.55rem' }}>{hint}</span>}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${focus ? '#58a6ff' : '#30363d'}`, borderRadius: 6, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: focus ? '0 0 0 3px #58a6ff18' : 'none' }}>
        {prefix && <div style={{ padding: '0 12px', background: '#21262d', color: '#58a6ff', fontSize: '0.72rem', borderRight: '1px solid #30363d', height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{prefix}</div>}
        <input type="text" value={value} onChange={onChange} onKeyDown={onKeyDown}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder={placeholder} autoComplete="off" spellCheck={false}
          style={{ flex: 1, background: '#0d1117', border: 'none', outline: 'none', color: '#e6edf3', padding: '12px 14px', fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", minWidth: 0 }} />
      </div>
    </div>
  )
}

export default function Home() {
  const [repoInput, setRepoInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [scanTarget, setScanTarget] = useState('')
  const progressRef = useRef({ cur: 0, target: 0, iv: null })

  const setProgressTarget = useCallback((val) => {
    const p = progressRef.current
    p.target = val
    clearInterval(p.iv)
    p.iv = setInterval(() => {
      if (p.cur < p.target) { p.cur = Math.min(p.cur + 1, p.target); setProgress(p.cur) }
      else clearInterval(p.iv)
    }, 60)
  }, [])

  const advanceStage = useCallback((id) => {
    const idx = STAGES.findIndex(s => s.id === id)
    setCurrentStage(id)
    setProgressTarget(Math.round(((idx + 1) / STAGES.length) * 100))
  }, [setProgressTarget])

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const handleScan = async () => {
    if (!repoInput.trim()) { setError('TARGET REPOSITORY URL REQUIRED'); return }
    const m = repoInput.match(/(?:github\.com\/)?([^/\s]+\/[^/\s?#]+)/)
    if (!m) { setError('INVALID FORMAT — USE: owner/repo or github.com/owner/repo'); return }
    const fullUrl = `https://github.com/${m[1].replace(/\.git$/, '')}`
    setError(''); setResult(null); setLoading(true); setScanTarget(fullUrl)
    progressRef.current = { cur: 0, target: 0, iv: null }; setProgress(0)
    try {
      advanceStage('init');     await sleep(350)
      advanceStage('repo');     await sleep(300)
      advanceStage('tree');     await sleep(280)
      advanceStage('dll');      await sleep(250)
      advanceStage('deps');     await sleep(250)
      advanceStage('security'); await sleep(280)
      advanceStage('hermes')
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: fullUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)
      clearInterval(progressRef.current.iv)
      progressRef.current.cur = 100; setProgress(100)
      advanceStage('done'); await sleep(600)
      setResult(data)
    } catch (err) {
      setError(err.message || 'SCAN FAILED — CHECK CONFIGURATION')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleScan() }
  const setQuickRepo = (r) => { setRepoInput(r); setError('') }
  const repoValue = repoInput.startsWith('https://github.com/') ? repoInput.replace('https://github.com/', '') : repoInput

  return (
    <>
      <Head>
        <title>RepoSpectre — AI Repository Intelligence Agent</title>
        <meta name="description" content="Deep scan any GitHub repository: security, DLL detection, dependency analysis — powered by Hermes-4-70B." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MatrixRain />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* TOP BAR */}
        <div style={{ borderBottom: '1px solid #21262d', padding: '9px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,17,23,0.93)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.2em' }}>
              <span style={{ color: '#3fb950' }}>REPO</span><span style={{ color: '#e6edf3' }}>SPECTRE</span>
            </span>
            <span style={{ fontSize: '0.56rem', color: '#3fb950', border: '1px solid #3fb95038', padding: '2px 8px', borderRadius: 2, letterSpacing: '0.15em' }}>v2.0</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: '0.6rem', color: '#484f58', letterSpacing: '0.1em', flexWrap: 'wrap' }}>
            <span><span style={{ color: '#3fb950' }}>●</span> ONLINE</span>
            <span>HERMES-4-70B</span>
            <span>NOUS RESEARCH</span>
            <span style={{ color: '#21262d' }}>|</span>
            <StatusTicker />
          </div>
        </div>

        <main style={{ maxWidth: 940, margin: '0 auto', padding: '44px 20px 80px', width: '100%', flex: 1 }}>

          {/* HERO */}
          <FadeIn delay={100} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ marginBottom: 18 }}><GlitchTitle /></div>
            <div style={{ height: 26, marginBottom: 8 }}>
              <TypewriterLine text="> AI REPOSITORY INTELLIGENCE AGENT" delay={500} speed={32} color="#58a6ff" fontSize="0.8rem" letterSpacing="0.22em" />
            </div>
            <div style={{ height: 20 }}>
              <TypewriterLine text="> HERMES-4-70B · SECURITY AUDIT · DLL SCANNER · DEPENDENCY ANALYSIS" delay={2000} speed={20} color="#484f58" fontSize="0.6rem" letterSpacing="0.1em" />
            </div>
          </FadeIn>

          {/* STATS */}
          <FadeIn delay={300}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 30 }}>
              <StatBox label="SCAN MODULES"  value="12" />
              <StatBox label="AI MODEL"      value="H4-70B" />
              <StatBox label="BINARY CHECKS" value="48+" />
              <StatBox label="STATUS" value={loading ? 'ACTIVE' : result ? 'DONE' : 'READY'} accent={loading || !!result} />
            </div>
          </FadeIn>

          {/* INPUT PANEL */}
          <FadeIn delay={500}>
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <HexGrid />
              <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
                <TermLine text="REPOSPECTRE v2.0 AGENT INITIALIZED"                               color="#3fb950" delay={100} />
                <TermLine text="HERMES-4-70B NEURAL CORE — NOUS RESEARCH"                        color="#58a6ff" delay={400} />
                <TermLine text="MODULES LOADED: GITHUB_RECON, DLL_SCAN, SEC_AUDIT, DEP_ANALYSIS" color="#8b949e" delay={800} />
                <TermLine text="AWAITING TARGET COORDINATES..."                                   color="#484f58" delay={1200} prefix="$" />
              </div>
              <div style={{ fontSize: '0.62rem', color: '#58a6ff', letterSpacing: '0.2em', marginBottom: 16, fontWeight: 700 }}>◈ DEFINE SCAN TARGET</div>
              <InputField label="TARGET REPOSITORY" prefix="github.com/" placeholder="owner/repository-name" value={repoValue} onChange={e => setRepoInput(e.target.value)} onKeyDown={handleKey} />
              {error && (
                <div style={{ padding: '10px 14px', marginBottom: 14, background: '#f8514912', border: '1px solid #f8514938', borderRadius: 6, fontSize: '0.68rem', color: '#f85149' }}>
                  ⚠ ERROR: {error}
                </div>
              )}
              <ScanButton loading={loading} onClick={handleScan} />
              {!loading && !result && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.56rem', color: '#484f58', letterSpacing: '0.15em', marginBottom: 8 }}>SAMPLE TARGETS</div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {['facebook/react','microsoft/vscode','torvalds/linux','vitejs/vite','vercel/next.js'].map(r => (
                      <QuickBtn key={r} repo={r} onClick={setQuickRepo} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* SCAN CONFIG */}
          <FadeIn delay={700}>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 6, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#484f58', letterSpacing: '0.1em' }}>SCAN CONFIG</div>
              {[
                { k: 'MODEL',    v: 'Hermes-4-70B',        color: '#3fb950' },
                { k: 'PROVIDER', v: 'Nous Research',        color: '#8b949e' },
                { k: 'API KEY',  v: 'Stored in Vercel Env', color: '#8b949e' },
                { k: 'GITHUB',   v: 'REST API v3',          color: '#8b949e' },
              ].map(({ k, v, color }) => (
                <div key={k} style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                  <span style={{ color: '#484f58' }}>{k}: </span>
                  <span style={{ color }}>{v}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {loading && <ScanProgress currentStage={currentStage} progress={progress} />}
          {result && <ResultGrid data={result} repoMeta={result.repo_info} repoUrl={scanTarget} />}

          {!loading && !result && (
            <FadeIn delay={900} style={{ textAlign: 'center', padding: '52px 24px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 20, opacity: 0.12 }}>👁</div>
              <div style={{ display: 'inline-block', padding: '24px 40px', border: '1px solid #21262d', borderRadius: 8 }}>
                <div style={{ fontSize: '0.65rem', color: '#484f58', letterSpacing: '0.2em', marginBottom: 8 }}>REPOSPECTRE AWAITS TARGET</div>
                <div style={{ fontSize: '0.6rem', color: '#30363d', letterSpacing: '0.1em' }}>Enter any public GitHub repository URL above to begin</div>
              </div>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { icon: '⬡', label: 'SECURITY AUDIT', color: '#f85149' },
                  { icon: '◉', label: 'DLL DETECTION',  color: '#d29922' },
                  { icon: '◈', label: 'DEPENDENCY SCAN',color: '#a371f7' },
                  { icon: '◈', label: 'CODE QUALITY',   color: '#58a6ff' },
                  { icon: '◉', label: 'AI VERDICT',     color: '#3fb950' },
                ].map(({ icon, label, color }) => (
                  <div key={label} style={{ padding: '8px 14px', background: '#161b22', border: `1px solid ${color}20`, borderRadius: 6, fontSize: '0.58rem', letterSpacing: '0.12em', color: '#8b949e', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color }}>{icon}</span>{label}
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

        </main>

        <div style={{ borderTop: '1px solid #21262d', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, background: 'rgba(13,17,23,0.6)' }}>
          <span style={{ fontSize: '0.58rem', color: '#484f58', letterSpacing: '0.1em' }}>REPOSPECTRE © 2025 — AI REPOSITORY INTELLIGENCE AGENT</span>
          <span style={{ fontSize: '0.58rem', color: '#484f58', letterSpacing: '0.1em' }}>POWERED BY <span style={{ color: '#3fb950' }}>HERMES-4-70B</span> · NOUS RESEARCH</span>
        </div>

      </div>
    </>
  )
}
