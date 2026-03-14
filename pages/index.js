import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

const SCAN_STAGES = [
  { id: 'init', label: 'INITIALIZING AGENT', icon: '◈', color: '#58a6ff' },
  { id: 'repo', label: 'FETCHING REPOSITORY DATA', icon: '◉', color: '#58a6ff' },
  { id: 'tree', label: 'SCANNING FILE TREE', icon: '◈', color: '#58a6ff' },
  { id: 'dll', label: 'DLL/BINARY DETECTION', icon: '⬡', color: '#d29922' },
  { id: 'deps', label: 'ANALYZING DEPENDENCIES', icon: '◈', color: '#a371f7' },
  { id: 'security', label: 'RUNNING SECURITY AUDIT', icon: '⬡', color: '#f85149' },
  { id: 'hermes', label: 'DEPLOYING HERMES-3-70B', icon: '◉', color: '#3fb950' },
  { id: 'complete', label: 'ANALYSIS COMPLETE', icon: '✓', color: '#3fb950' },
];

function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノREPOSPECTREGITHUB';
    const fontSize = 12;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    let frame = 0;
    const draw = () => {
      if (frame % 3 !== 0) { frame++; requestAnimationFrame(draw); return; }
      ctx.fillStyle = 'rgba(13, 17, 23, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(63, 185, 80, 0.15)';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.4, pointerEvents: 'none' }} />;
}

function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h1 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 900,
        letterSpacing: '0.15em',
        color: '#e6edf3',
        textTransform: 'uppercase',
        position: 'relative',
        animation: glitch ? 'glitch 0.2s steps(2) infinite' : 'none',
      }}>
        <span style={{ color: '#3fb950' }}>REPO</span>SPECTRE
        {glitch && <>
          <span style={{
            position: 'absolute', top: 0, left: 0, color: '#f85149',
            clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)',
            transform: 'translate(-3px, -3px)', opacity: 0.8
          }}>REPOSPECTRE</span>
          <span style={{
            position: 'absolute', top: 0, left: 0, color: '#58a6ff',
            clipPath: 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)',
            transform: 'translate(3px, 3px)', opacity: 0.8
          }}>REPOSPECTRE</span>
        </>}
      </h1>
    </div>
  );
}

function TypewriterText({ text, delay = 0, speed = 40, style = {} }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);
  return <span style={style}>{displayed}{!done && <span style={{ animation: 'blink 1s step-end infinite' }}>▮</span>}</span>;
}

function ScanProgress({ stages, currentStage, progress }) {
  return (
    <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '24px', margin: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%', background: '#3fb950',
          boxShadow: '0 0 12px #3fb950',
          animation: 'ping-ring 1s ease-out infinite',
        }} />
        <span style={{ color: '#3fb950', fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 700 }}>
          AGENT ACTIVE — SCANNING TARGET
        </span>
        <span style={{ marginLeft: 'auto', color: '#8b949e', fontSize: '0.7rem' }}>{Math.round(progress)}%</span>
      </div>
      <div style={{ height: 3, background: '#21262d', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #3fb950, #58a6ff)',
          width: `${progress}%`,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px #3fb95060',
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stages.map((stage, idx) => {
          const stageIdx = stages.findIndex(s => s.id === currentStage);
          const isDone = idx < stageIdx || currentStage === 'complete';
          const isActive = stages[stageIdx]?.id === stage.id && currentStage !== 'complete';
          return (
            <div key={stage.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: idx > stageIdx && currentStage !== 'complete' ? 0.3 : 1,
              transition: 'opacity 0.3s',
            }}>
              <span style={{
                fontSize: '0.8rem',
                color: isDone ? '#3fb950' : isActive ? stage.color : '#484f58',
                animation: isActive ? 'spin 1s linear infinite' : 'none',
                display: 'inline-block',
                minWidth: 16, textAlign: 'center',
              }}>
                {isDone ? '✓' : stage.icon}
              </span>
              <span style={{
                fontSize: '0.7rem', letterSpacing: '0.15em',
                color: isDone ? '#8b949e' : isActive ? stage.color : '#484f58',
                fontWeight: isActive ? 700 : 400,
              }}>
                {stage.label}
                {isActive && <span style={{ animation: 'blink 0.7s step-end infinite' }}> ▮</span>}
              </span>
              {isActive && <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: stage.color,
                    animation: `blink 0.5s step-end ${d * 0.15}s infinite`,
                  }} />
                ))}
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreRing({ score, color, label, size = 80 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        setAnimated(Math.min(current, score));
        if (current >= score) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);
  const strokeDash = (animated / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#21262d" strokeWidth={6} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontFamily: "'Orbitron', monospace", fontSize: '1rem', fontWeight: 700,
          color, textAlign: 'center',
        }}>
          {animated}
        </div>
      </div>
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: '#8b949e', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function ResultCard({ title, icon, color, children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      background: '#161b22',
      border: `1px solid ${color}40`,
      borderRadius: 8,
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      boxShadow: visible ? `0 0 30px ${color}15` : 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px',
        borderBottom: `1px solid ${color}30`,
        background: `${color}08`,
      }}>
        <span style={{ fontSize: '1rem', filter: `drop-shadow(0 0 4px ${color})` }}>{icon}</span>
        <span style={{
          fontFamily: "'Orbitron', monospace", fontSize: '0.7rem',
          fontWeight: 700, letterSpacing: '0.15em', color,
        }}>{title}</span>
      </div>
      <div style={{ padding: '18px' }}>{children}</div>
    </div>
  );
}

function Badge({ text, variant = 'default' }) {
  const colors = {
    success: { bg: '#3fb95020', color: '#3fb950', border: '#3fb95040' },
    warning: { bg: '#d2992220', color: '#d29922', border: '#d2992240' },
    danger: { bg: '#f8514920', color: '#f85149', border: '#f8514940' },
    info: { bg: '#58a6ff20', color: '#58a6ff', border: '#58a6ff40' },
    purple: { bg: '#a371f720', color: '#a371f7', border: '#a371f740' },
    default: { bg: '#21262d', color: '#8b949e', border: '#30363d' },
  };
  const c = colors[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 4, fontSize: '0.65rem',
      letterSpacing: '0.1em', fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{text}</span>
  );
}

function DataRow({ label, value, valueStyle = {} }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #21262d' }}>
      <span style={{ fontSize: '0.7rem', color: '#8b949e', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '0.72rem', color: '#e6edf3', fontWeight: 500, ...valueStyle }}>{value}</span>
    </div>
  );
}

function IssueItem({ issue, severity }) {
  const sevColors = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info', info: 'default' };
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #21262d' }}>
      <Badge text={severity?.toUpperCase() || 'INFO'} variant={sevColors[severity?.toLowerCase()] || 'default'} />
      <span style={{ fontSize: '0.7rem', color: '#c9d1d9', lineHeight: 1.6, flex: 1 }}>{issue}</span>
    </div>
  );
}

function FileItem({ name, type, suspicious }) {
  const typeColors = { dll: '#f85149', exe: '#f85149', bin: '#d29922', so: '#d29922', other: '#8b949e' };
  const color = suspicious ? '#f85149' : typeColors[type] || '#8b949e';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #21262d' }}>
      <span style={{ fontSize: '0.65rem', color, fontFamily: 'monospace' }}>
        {suspicious ? '⚠' : '◈'}
      </span>
      <span style={{ fontSize: '0.7rem', color, fontFamily: 'monospace', flex: 1 }}>{name}</span>
      <Badge text={type?.toUpperCase() || 'FILE'} variant={suspicious ? 'danger' : 'default'} />
    </div>
  );
}

function ScanResults({ data, repoUrl }) {
  if (!data) return null;
  const { overview, security, dll_scan, dependencies, code_quality, agent_verdict, repo_info } = data;

  const healthColor = (overview?.health_score || 0) >= 80 ? '#3fb950' : (overview?.health_score || 0) >= 60 ? '#d29922' : '#f85149';
  const secColor = (security?.score || 0) >= 80 ? '#3fb950' : (security?.score || 0) >= 60 ? '#d29922' : '#f85149';
  const cqColor = (code_quality?.score || 0) >= 80 ? '#3fb950' : (code_quality?.score || 0) >= 60 ? '#d29922' : '#f85149';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>

      {/* Header */}
      <div style={{
        background: '#161b22', border: '1px solid #3fb95040', borderRadius: 8,
        padding: '20px 24px', opacity: 0, animation: 'fadeInUp 0.5s ease 0.1s forwards',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#3fb950' }}>
            SCAN COMPLETE — TARGET ANALYZED
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#58a6ff', marginBottom: 8 }}>
          {repoUrl}
        </div>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 20 }}>
          <ScoreRing score={overview?.health_score || 0} color={healthColor} label="HEALTH" />
          <ScoreRing score={security?.score || 0} color={secColor} label="SECURITY" />
          <ScoreRing score={code_quality?.score || 0} color={cqColor} label="QUALITY" />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.7rem', color: '#8b949e', marginBottom: 8, letterSpacing: '0.1em' }}>RISK LEVEL</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge text={overview?.risk_level?.toUpperCase() || 'UNKNOWN'}
                variant={overview?.risk_level === 'low' ? 'success' : overview?.risk_level === 'medium' ? 'warning' : 'danger'} />
              {repo_info?.language && <Badge text={repo_info.language.toUpperCase()} variant="info" />}
              {repo_info?.license && <Badge text={repo_info.license.toUpperCase()} variant="purple" />}
            </div>
            <p style={{ fontSize: '0.7rem', color: '#8b949e', lineHeight: 1.7, marginTop: 12 }}>
              {overview?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>

        {/* Repo Overview */}
        <ResultCard title="REPOSITORY OVERVIEW" icon="◈" color="#58a6ff" delay={200}>
          {repo_info && <>
            <DataRow label="Stars" value={`★ ${(repo_info.stars || 0).toLocaleString()}`} />
            <DataRow label="Forks" value={`⑂ ${(repo_info.forks || 0).toLocaleString()}`} />
            <DataRow label="Open Issues" value={repo_info.open_issues || 0} />
            <DataRow label="Size" value={`${Math.round((repo_info.size || 0) / 1024 * 10) / 10} MB`} />
            <DataRow label="Default Branch" value={repo_info.default_branch || 'main'} />
            <DataRow label="Last Commit" value={repo_info.last_push ? new Date(repo_info.last_push).toLocaleDateString() : 'N/A'} />
            <DataRow label="Topics" value={repo_info.topics?.length ? repo_info.topics.slice(0,3).join(', ') : 'None'} />
          </>}
          {overview?.key_findings?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.65rem', color: '#58a6ff', letterSpacing: '0.15em', marginBottom: 8 }}>KEY FINDINGS</div>
              {overview.key_findings.map((f, i) => (
                <div key={i} style={{ fontSize: '0.7rem', color: '#8b949e', lineHeight: 1.6, padding: '4px 0' }}>
                  <span style={{ color: '#58a6ff' }}>→</span> {f}
                </div>
              ))}
            </div>
          )}
        </ResultCard>

        {/* Security Audit */}
        <ResultCard title="SECURITY AUDIT" icon="⬡" color="#f85149" delay={350}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: "'Orbitron', monospace", fontWeight: 700,
                color: secColor, textShadow: `0 0 20px ${secColor}` }}>
                {security?.score || 0}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#8b949e', letterSpacing: '0.1em' }}>SECURITY SCORE</div>
            </div>
          </div>
          {security?.issues?.length > 0 ? (
            <>
              <div style={{ fontSize: '0.65rem', color: '#f85149', letterSpacing: '0.15em', marginBottom: 8 }}>DETECTED ISSUES</div>
              {security.issues.slice(0,5).map((issue, i) => (
                <IssueItem key={i} issue={typeof issue === 'string' ? issue : issue.description} severity={typeof issue === 'object' ? issue.severity : 'medium'} />
              ))}
            </>
          ) : (
            <div style={{ fontSize: '0.7rem', color: '#3fb950', padding: '8px 0' }}>✓ No critical security issues detected</div>
          )}
          {security?.recommendations?.slice(0,3).map((r, i) => (
            <div key={i} style={{ fontSize: '0.68rem', color: '#8b949e', lineHeight: 1.6, padding: '4px 0' }}>
              <span style={{ color: '#d29922' }}>⚠</span> {r}
            </div>
          ))}
        </ResultCard>

        {/* DLL Scanner */}
        <ResultCard title="DLL / BINARY SCANNER" icon="◉" color="#d29922" delay={500}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Badge text={dll_scan?.verdict?.toUpperCase() || 'SCANNING'}
              variant={dll_scan?.verdict === 'clean' ? 'success' : dll_scan?.verdict === 'suspicious' ? 'warning' : 'danger'} />
            <Badge text={`${dll_scan?.found?.length || 0} FILES FOUND`} variant="default" />
          </div>
          {dll_scan?.found?.length > 0 ? (
            <>
              <div style={{ fontSize: '0.65rem', color: '#d29922', letterSpacing: '0.15em', marginBottom: 8 }}>DETECTED BINARIES</div>
              {dll_scan.found.map((file, i) => (
                <FileItem key={i}
                  name={typeof file === 'string' ? file : file.name}
                  type={typeof file === 'object' ? file.type : file.split('.').pop()}
                  suspicious={typeof file === 'object' ? file.suspicious : false}
                />
              ))}
            </>
          ) : (
            <div style={{ fontSize: '0.7rem', color: '#3fb950', padding: '8px 0' }}>✓ No DLL or binary files detected</div>
          )}
          {dll_scan?.suspicious?.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px', background: '#f8514910', borderRadius: 4, border: '1px solid #f8514930' }}>
              <div style={{ fontSize: '0.65rem', color: '#f85149', marginBottom: 4 }}>⚠ SUSPICIOUS FILES REQUIRE REVIEW</div>
              {dll_scan.suspicious.map((f, i) => (
                <div key={i} style={{ fontSize: '0.68rem', color: '#8b949e' }}>• {f}</div>
              ))}
            </div>
          )}
        </ResultCard>

        {/* Dependencies */}
        <ResultCard title="DEPENDENCY ANALYSIS" icon="◈" color="#a371f7" delay={650}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'TOTAL', value: dependencies?.total || 0, color: '#8b949e' },
              { label: 'OUTDATED', value: dependencies?.outdated || 0, color: '#d29922' },
              { label: 'VULNERABLE', value: dependencies?.vulnerable || 0, color: '#f85149' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '10px', background: '#0d1117', borderRadius: 6, border: '1px solid #21262d' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.3rem', fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: '0.55rem', color: '#484f58', letterSpacing: '0.1em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          {dependencies?.details?.slice(0,6).map((dep, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #21262d' }}>
              <span style={{ fontSize: '0.68rem', color: '#c9d1d9', fontFamily: 'monospace' }}>
                {typeof dep === 'string' ? dep : dep.name}
              </span>
              {typeof dep === 'object' && dep.status && (
                <Badge text={dep.status.toUpperCase()}
                  variant={dep.status === 'ok' ? 'success' : dep.status === 'outdated' ? 'warning' : 'danger'} />
              )}
            </div>
          ))}
        </ResultCard>

        {/* Code Quality */}
        <ResultCard title="CODE QUALITY" icon="◈" color="#58a6ff" delay={800}>
          {code_quality?.insights?.slice(0,6).map((insight, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #21262d' }}>
              <span style={{ color: '#58a6ff', fontSize: '0.7rem' }}>◈</span>
              <span style={{ fontSize: '0.7rem', color: '#8b949e', lineHeight: 1.6 }}>
                {typeof insight === 'string' ? insight : insight.text || insight.description}
              </span>
            </div>
          ))}
        </ResultCard>

        {/* AI Verdict */}
        <ResultCard title="HERMES AGENT VERDICT" icon="◉" color="#3fb950" delay={950}>
          <div style={{
            padding: '16px', background: '#0d1117', borderRadius: 6,
            border: '1px solid #3fb95030', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #3fb95005 20px, #3fb95005 21px)',
              pointerEvents: 'none',
            }} />
            <div style={{ fontSize: '0.7rem', color: '#3fb950', lineHeight: 1.8, fontStyle: 'italic', position: 'relative' }}>
              <span style={{ color: '#3fb95080', fontSize: '1.2rem' }}>"</span>
              {agent_verdict}
              <span style={{ color: '#3fb95080', fontSize: '1.2rem' }}>"</span>
            </div>
            <div style={{ marginTop: 12, fontSize: '0.6rem', color: '#484f58', letterSpacing: '0.15em' }}>
              — REPOSPECTRE / HERMES-3-70B
            </div>
          </div>
        </ResultCard>

      </div>
    </div>
  );
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const terminalRef = useRef(null);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) { setError('TARGET REPOSITORY URL REQUIRED'); return; }
    if (!repoUrl.includes('github.com')) { setError('INVALID TARGET — MUST BE GITHUB URL'); return; }
    if (!apiKey.trim()) { setError('OPENROUTER API KEY REQUIRED'); return; }

    setError('');
    setResult(null);
    setLoading(true);
    setProgress(0);
    setCurrentStage('init');

    const stages = SCAN_STAGES.map(s => s.id);
    let stageIdx = 0;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = ((stageIdx + 1) / stages.length) * 100;
        return prev < target - 5 ? prev + 1 : prev;
      });
    }, 200);

    const advanceStage = (id) => {
      stageIdx = stages.indexOf(id);
      setCurrentStage(id);
    };

    try {
      advanceStage('repo');
      await new Promise(r => setTimeout(r, 500));
      advanceStage('tree');
      await new Promise(r => setTimeout(r, 400));
      advanceStage('dll');
      await new Promise(r => setTimeout(r, 300));
      advanceStage('deps');
      await new Promise(r => setTimeout(r, 300));
      advanceStage('security');
      await new Promise(r => setTimeout(r, 300));
      advanceStage('hermes');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, apiKey }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');

      clearInterval(progressInterval);
      setProgress(100);
      advanceStage('complete');
      await new Promise(r => setTimeout(r, 600));
      setResult(data);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'SCAN FAILED — CHECK CREDENTIALS');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <>
      <Head>
        <title>RepoSpectre — AI Repository Intelligence Agent</title>
        <meta name="description" content="RepoSpectre: AI-powered GitHub repository analysis agent. Powered by Hermes-3-70B. Detects DLLs, security vulnerabilities, analyzes dependencies, and provides deep code intelligence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d1117" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👁</text></svg>" />
        <meta property="og:title" content="RepoSpectre — AI Repository Intelligence Agent" />
        <meta property="og:description" content="Analyze any GitHub repo with Hermes-3-70B AI. Security audits, DLL detection, dependency analysis." />
      </Head>

      <MatrixRain />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* Top bar */}
        <div style={{
          borderBottom: '1px solid #30363d',
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(13,17,23,0.9)',
          backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em' }}>
              <span style={{ color: '#3fb950' }}>REPO</span><span style={{ color: '#e6edf3' }}>SPECTRE</span>
            </span>
            <span style={{ fontSize: '0.6rem', color: '#3fb950', border: '1px solid #3fb95040', padding: '2px 8px', borderRadius: 2, letterSpacing: '0.15em' }}>
              v1.0 AGENT
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: '0.65rem', color: '#484f58', letterSpacing: '0.1em' }}>
            <span style={{ color: '#3fb950' }}>● ONLINE</span>
            <span>HERMES-3-70B</span>
            <span>OPENROUTER</span>
          </div>
        </div>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ marginBottom: 16, opacity: 0, animation: 'fadeInUp 0.6s ease 0.1s forwards' }}>
              <GlitchTitle />
            </div>
            <div style={{ height: 24, marginBottom: 8, opacity: 0, animation: 'fadeInUp 0.6s ease 0.4s forwards' }}>
              <TypewriterText
                text="> AI REPOSITORY INTELLIGENCE AGENT"
                delay={600}
                speed={35}
                style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#58a6ff' }}
              />
            </div>
            <div style={{ height: 20, opacity: 0, animation: 'fadeInUp 0.6s ease 0.5s forwards' }}>
              <TypewriterText
                text="> POWERED BY HERMES-3-70B · SECURITY · DLL DETECTION · DEEP ANALYSIS"
                delay={2000}
                speed={25}
                style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: '#484f58' }}
              />
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
            marginBottom: 32, opacity: 0, animation: 'fadeInUp 0.6s ease 0.8s forwards',
          }}>
            {[
              { label: 'SCAN MODULES', value: '12' },
              { label: 'AI MODEL', value: 'H3-70B' },
              { label: 'DETECTIONS', value: '48+' },
              { label: 'STATUS', value: 'READY' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '14px 16px', background: '#161b22',
                border: '1px solid #21262d', textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1rem', fontWeight: 700, color: '#e6edf3' }}>{value}</div>
                <div style={{ fontSize: '0.55rem', color: '#484f58', letterSpacing: '0.15em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
            padding: '24px', marginBottom: 24,
            opacity: 0, animation: 'fadeInUp 0.6s ease 1s forwards',
          }}>
            <div style={{ fontSize: '0.65rem', color: '#58a6ff', letterSpacing: '0.2em', marginBottom: 16 }}>
              ◈ DEFINE TARGET
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.62rem', color: '#8b949e', letterSpacing: '0.15em', marginBottom: 6 }}>
                TARGET REPOSITORY
              </label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1px solid ${inputFocus ? '#58a6ff' : '#30363d'}`,
                borderRadius: 6, overflow: 'hidden',
                transition: 'border-color 0.2s',
                boxShadow: inputFocus ? '0 0 0 3px #58a6ff20' : 'none',
              }}>
                <span style={{ padding: '0 12px', color: '#58a6ff', fontSize: '0.75rem', background: '#21262d' }}>
                  github.com/
                </span>
                <input
                  type="text"
                  placeholder="owner/repository-name"
                  value={repoUrl.replace('https://github.com/', '').replace('https://www.github.com/', '')}
                  onChange={e => setRepoUrl('https://github.com/' + e.target.value)}
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1, background: '#0d1117', border: 'none', outline: 'none',
                    color: '#e6edf3', padding: '12px 16px', fontSize: '0.8rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.62rem', color: '#8b949e', letterSpacing: '0.15em', marginBottom: 6 }}>
                OPENROUTER API KEY <span style={{ color: '#484f58' }}>(get free key at openrouter.ai)</span>
              </label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden',
              }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk-or-v1-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  style={{
                    flex: 1, background: '#0d1117', border: 'none', outline: 'none',
                    color: '#e6edf3', padding: '12px 16px', fontSize: '0.78rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
                <button onClick={() => setShowApiKey(!showApiKey)} style={{
                  padding: '0 14px', background: '#21262d', border: 'none', cursor: 'pointer',
                  color: '#8b949e', fontSize: '0.7rem', height: '100%',
                }}>{showApiKey ? '◉ HIDE' : '◈ SHOW'}</button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', background: '#f8514915', border: '1px solid #f8514940',
                borderRadius: 6, fontSize: '0.7rem', color: '#f85149', marginBottom: 16,
                letterSpacing: '0.05em',
              }}>
                ⚠ ERROR: {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#21262d' : 'linear-gradient(135deg, #3fb950, #2ea043)',
                border: loading ? '1px solid #30363d' : '1px solid #3fb950',
                borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                color: loading ? '#484f58' : '#0d1117',
                fontFamily: "'Orbitron', monospace", fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.2em',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 0 20px #3fb95030',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◈</span>
                  AGENT SCANNING...
                </span>
              ) : '▶ INITIATE DEEP SCAN'}
            </button>
          </div>

          {/* Scanning Progress */}
          {loading && <ScanProgress stages={SCAN_STAGES} currentStage={currentStage} progress={progress} />}

          {/* Results */}
          {result && <ScanResults data={result} repoUrl={repoUrl} />}

          {/* Empty state */}
          {!loading && !result && !error && (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              opacity: 0, animation: 'fadeIn 0.6s ease 1.4s forwards',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.2 }}>👁</div>
              <div style={{ fontSize: '0.65rem', color: '#484f58', letterSpacing: '0.2em' }}>
                REPOSPECTRE AWAITS TARGET
              </div>
              <div style={{ fontSize: '0.6rem', color: '#30363d', marginTop: 8, letterSpacing: '0.1em' }}>
                Enter any public GitHub repository URL to begin analysis
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
                {['facebook/react', 'microsoft/vscode', 'torvalds/linux', 'vuejs/vue'].map(repo => (
                  <button key={repo} onClick={() => setRepoUrl(`https://github.com/${repo}`)} style={{
                    padding: '6px 12px', background: '#161b22', border: '1px solid #30363d',
                    borderRadius: 4, cursor: 'pointer', color: '#58a6ff',
                    fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
                    transition: 'border-color 0.2s',
                  }}>
                    {repo}
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #21262d', padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: '0.6rem', color: '#484f58', letterSpacing: '0.1em' }}>
            REPOSPECTRE © 2025 — AI REPOSITORY INTELLIGENCE AGENT
          </span>
          <span style={{ fontSize: '0.6rem', color: '#484f58', letterSpacing: '0.1em' }}>
            POWERED BY <span style={{ color: '#3fb950' }}>HERMES-3-70B</span> VIA OPENROUTER
          </span>
        </div>
      </div>
    </>
  );
}
