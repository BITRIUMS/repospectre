const STAGES = [
  { id: 'init',     label: 'INITIALIZING AGENT',      icon: '◈', color: '#58a6ff' },
  { id: 'repo',     label: 'FETCHING REPOSITORY DATA', icon: '◉', color: '#58a6ff' },
  { id: 'tree',     label: 'SCANNING FILE TREE',       icon: '◈', color: '#58a6ff' },
  { id: 'dll',      label: 'DLL / BINARY DETECTION',   icon: '⬡', color: '#d29922' },
  { id: 'deps',     label: 'ANALYZING DEPENDENCIES',   icon: '◈', color: '#a371f7' },
  { id: 'security', label: 'RUNNING SECURITY AUDIT',   icon: '⬡', color: '#f85149' },
  { id: 'hermes',   label: 'DEPLOYING HERMES-4-70B',   icon: '◉', color: '#3fb950' },
  { id: 'done',     label: 'ANALYSIS COMPLETE',        icon: '✓', color: '#3fb950' },
]

export { STAGES }

export default function ScanProgress({ currentStage, progress }) {
  const activeIdx = STAGES.findIndex(s => s.id === currentStage)

  return (
    <div style={{
      background: '#161b22', border: '1px solid #30363d',
      borderRadius: 8, padding: '22px', margin: '20px 0',
      animation: 'fadeUp 0.3s ease both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#3fb950', boxShadow: '0 0 10px #3fb950',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            background: '#3fb950', opacity: 0.4,
            animation: 'ping 1.2s ease-out infinite',
          }} />
        </div>
        <span style={{ color: '#3fb950', fontSize: '0.68rem', letterSpacing: '0.18em', fontWeight: 700 }}>
          AGENT ACTIVE — SCANNING TARGET
        </span>
        <span style={{ marginLeft: 'auto', color: '#8b949e', fontSize: '0.68rem' }}>
          {Math.round(progress)}%
        </span>
      </div>

      <div style={{ height: 3, background: '#21262d', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #3fb950, #58a6ff)',
          width: `${progress}%`,
          transition: 'width 0.35s ease',
          boxShadow: '0 0 10px #3fb95060',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {STAGES.map((stage, i) => {
          const isDone = i < activeIdx || currentStage === 'done'
          const isActive = i === activeIdx && currentStage !== 'done'
          const isDim = i > activeIdx && currentStage !== 'done'

          return (
            <div key={stage.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: isDim ? 0.25 : 1,
              transition: 'opacity 0.3s',
            }}>
              <span style={{
                fontSize: '0.78rem', minWidth: 14, textAlign: 'center',
                color: isDone ? '#3fb950' : isActive ? stage.color : '#484f58',
                display: 'inline-block',
                animation: isActive ? 'spin 1s linear infinite' : 'none',
              }}>
                {isDone ? '✓' : stage.icon}
              </span>
              <span style={{
                fontSize: '0.65rem', letterSpacing: '0.14em',
                color: isDone ? '#8b949e' : isActive ? stage.color : '#484f58',
                fontWeight: isActive ? 700 : 400,
              }}>
                {stage.label}
                {isActive && <span style={{ animation: 'blink 0.7s step-end infinite' }}> ▮</span>}
              </span>
              {isActive && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: stage.color,
                      animation: `blink 0.5s step-end ${d * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
