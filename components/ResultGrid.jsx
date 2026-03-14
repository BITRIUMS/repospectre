import ScoreRing from './ScoreRing'
import Card, { DataRow } from './ui/Card'
import Badge, { riskVariant, severityVariant } from './ui/Badge'

function scoreColor(n) {
  return n >= 80 ? '#3fb950' : n >= 60 ? '#d29922' : '#f85149'
}

function BigScore({ score, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: '2.2rem', fontWeight: 700,
        color, textShadow: `0 0 18px ${color}`,
        lineHeight: 1,
      }}>{score}</div>
      <div style={{ fontSize: '0.56rem', color: '#484f58', letterSpacing: '0.12em', marginTop: 4 }}>SCORE / 100</div>
    </div>
  )
}

export default function ResultGrid({ data, repoMeta, repoUrl }) {
  const { overview, security, dll_scan, dependencies, code_quality, agent_verdict, meta } = data
  const hColor = scoreColor(overview?.health_score || 0)
  const sColor = scoreColor(security?.score || 0)
  const qColor = scoreColor(code_quality?.score || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>

      {/* SUMMARY HEADER */}
      <div style={{
        background: '#161b22', border: '1px solid #3fb95038', borderRadius: 8,
        padding: '20px 22px',
        animation: 'fadeUp 0.4s ease 0.1s both',
        boxShadow: '0 0 40px #3fb95010',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#3fb950', boxShadow: '0 0 8px #3fb950',
          }} />
          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.62rem', letterSpacing: '0.18em', color: '#3fb950', fontWeight: 700 }}>
            SCAN COMPLETE — INTELLIGENCE REPORT READY
          </span>
          {meta && (
            <span style={{ marginLeft: 'auto', fontSize: '0.58rem', color: '#484f58', letterSpacing: '0.1em' }}>
              {meta.model} · {meta.files_scanned} FILES
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.72rem', color: '#58a6ff', marginBottom: 16, wordBreak: 'break-all' }}>
          {repoUrl}
        </div>

        <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ScoreRing score={overview?.health_score || 0} color={hColor} label="HEALTH" />
          <ScoreRing score={security?.score || 0} color={sColor} label="SECURITY" />
          <ScoreRing score={code_quality?.score || 0} color={qColor} label="QUALITY" />

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.62rem', color: '#8b949e', letterSpacing: '0.12em', marginBottom: 8 }}>RISK ASSESSMENT</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
              <Badge text={(overview?.risk_level || '?').toUpperCase()} variant={riskVariant(overview?.risk_level)} />
              {repoMeta?.language && <Badge text={repoMeta.language.toUpperCase()} variant="info" />}
              {repoMeta?.license && <Badge text={repoMeta.license.toUpperCase()} variant="purple" />}
              {repoMeta?.has_ci && <Badge text="CI/CD" variant="success" />}
              {repoMeta?.has_tests && <Badge text="TESTS" variant="success" />}
            </div>
            <p style={{ fontSize: '0.68rem', color: '#8b949e', lineHeight: 1.78 }}>
              {overview?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* CARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>

        {/* REPO OVERVIEW */}
        <Card title="REPOSITORY OVERVIEW" icon="◈" color="#58a6ff" delay={150}>
          {repoMeta && <>
            <DataRow label="Stars" value={`★ ${(repoMeta.stars || 0).toLocaleString()}`} />
            <DataRow label="Forks" value={`⑂ ${(repoMeta.forks || 0).toLocaleString()}`} />
            <DataRow label="Open Issues" value={repoMeta.open_issues || 0} />
            <DataRow label="Contributors" value={repoMeta.contributors || 'N/A'} />
            <DataRow label="Size" value={`${Math.round((repoMeta.size || 0) / 1024 * 10) / 10} MB`} />
            <DataRow label="Default Branch" value={repoMeta.default_branch || 'main'} />
            <DataRow label="Last Commit" value={repoMeta.last_push ? new Date(repoMeta.last_push).toLocaleDateString() : 'N/A'} />
            <DataRow label="Created" value={repoMeta.created_at ? new Date(repoMeta.created_at).toLocaleDateString() : 'N/A'} />
            {repoMeta.topics?.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {repoMeta.topics.slice(0, 5).map(t => (
                  <Badge key={t} text={t} variant="info" style={{ fontSize: '0.56rem' }} />
                ))}
              </div>
            )}
          </>}
          {overview?.key_findings?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.6rem', color: '#58a6ff', letterSpacing: '0.15em', marginBottom: 8 }}>KEY FINDINGS</div>
              {overview.key_findings.map((f, i) => (
                <div key={i} style={{ fontSize: '0.66rem', color: '#8b949e', lineHeight: 1.68, padding: '3px 0' }}>
                  <span style={{ color: '#58a6ff' }}>→</span> {f}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* SECURITY AUDIT */}
        <Card title="SECURITY AUDIT" icon="⬡" color="#f85149" delay={270}>
          <BigScore score={security?.score || 0} color={sColor} />
          {security?.issues?.length > 0 ? (
            <>
              <div style={{ fontSize: '0.6rem', color: '#f85149', letterSpacing: '0.15em', marginBottom: 8 }}>DETECTED ISSUES</div>
              {security.issues.slice(0, 6).map((issue, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #21262d' }}>
                  <Badge
                    text={(typeof issue === 'string' ? 'MEDIUM' : issue.severity?.toUpperCase() || 'INFO')}
                    variant={severityVariant(typeof issue === 'string' ? 'medium' : issue.severity)}
                  />
                  <span style={{ fontSize: '0.67rem', color: '#c9d1d9', lineHeight: 1.65, flex: 1 }}>
                    {typeof issue === 'string' ? issue : issue.description}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div style={{ fontSize: '0.7rem', color: '#3fb950', padding: '8px 0' }}>
              ✓ No critical security issues detected
            </div>
          )}
          {security?.recommendations?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.6rem', color: '#d29922', letterSpacing: '0.12em', marginBottom: 8 }}>RECOMMENDATIONS</div>
              {security.recommendations.slice(0, 3).map((r, i) => (
                <div key={i} style={{ fontSize: '0.66rem', color: '#8b949e', lineHeight: 1.65, padding: '3px 0' }}>
                  <span style={{ color: '#d29922' }}>⚠</span> {r}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* DLL SCANNER */}
        <Card title="DLL / BINARY SCANNER" icon="◉" color="#d29922" delay={390}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <Badge
              text={(dll_scan?.verdict || 'SCANNING').toUpperCase()}
              variant={dll_scan?.verdict === 'clean' ? 'success' : dll_scan?.verdict === 'suspicious' ? 'warning' : 'danger'}
            />
            <Badge text={`${dll_scan?.found?.length || 0} FILES FOUND`} variant="default" />
          </div>
          {dll_scan?.found?.length > 0 ? (
            <>
              <div style={{ fontSize: '0.6rem', color: '#d29922', letterSpacing: '0.15em', marginBottom: 8 }}>DETECTED BINARIES</div>
              {dll_scan.found.slice(0, 8).map((file, i) => {
                const isSus = typeof file === 'object' ? file.suspicious : false
                const name = typeof file === 'string' ? file : file.name
                const type = typeof file === 'object' ? file.type : name.split('.').pop()
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 0', borderBottom: '1px solid #21262d' }}>
                    <span style={{ color: isSus ? '#f85149' : '#d29922', fontSize: '0.7rem' }}>{isSus ? '⚠' : '◈'}</span>
                    <span style={{ fontSize: '0.67rem', fontFamily: 'monospace', flex: 1, color: isSus ? '#f85149' : '#c9d1d9' }}>{name}</span>
                    <Badge text={(type || 'FILE').toUpperCase()} variant={isSus ? 'danger' : 'default'} />
                  </div>
                )
              })}
            </>
          ) : (
            <div style={{ fontSize: '0.7rem', color: '#3fb950', padding: '8px 0' }}>
              ✓ No DLL or binary files detected
            </div>
          )}
          {dll_scan?.suspicious?.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px', background: '#f8514910', borderRadius: 4, border: '1px solid #f8514930' }}>
              <div style={{ fontSize: '0.6rem', color: '#f85149', marginBottom: 4 }}>⚠ SUSPICIOUS — MANUAL REVIEW REQUIRED</div>
              {dll_scan.suspicious.map((f, i) => (
                <div key={i} style={{ fontSize: '0.65rem', color: '#8b949e' }}>• {f}</div>
              ))}
            </div>
          )}
          {dll_scan?.analysis && (
            <div style={{ marginTop: 10, fontSize: '0.66rem', color: '#8b949e', lineHeight: 1.7 }}>
              {dll_scan.analysis}
            </div>
          )}
        </Card>

        {/* DEPENDENCIES */}
        <Card title="DEPENDENCY ANALYSIS" icon="◈" color="#a371f7" delay={510}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'TOTAL', val: dependencies?.total || 0, color: '#8b949e' },
              { label: 'OUTDATED', val: dependencies?.outdated || 0, color: '#d29922' },
              { label: 'VULNERABLE', val: dependencies?.vulnerable || 0, color: '#f85149' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '10px 6px', background: '#0d1117', borderRadius: 6, border: '1px solid #21262d' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.3rem', fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: '0.52rem', color: '#484f58', letterSpacing: '0.1em', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
          {dependencies?.ecosystem && (
            <div style={{ marginBottom: 12 }}>
              <Badge text={dependencies.ecosystem.toUpperCase()} variant="purple" />
            </div>
          )}
          {dependencies?.details?.slice(0, 7).map((dep, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #21262d' }}>
              <span style={{ fontSize: '0.67rem', fontFamily: 'monospace', color: '#c9d1d9' }}>
                {typeof dep === 'string' ? dep : dep.name}
              </span>
              {typeof dep === 'object' && dep.status && (
                <Badge
                  text={dep.status.toUpperCase()}
                  variant={dep.status === 'ok' ? 'success' : dep.status === 'outdated' ? 'warning' : 'danger'}
                />
              )}
            </div>
          ))}
          {dependencies?.notes && (
            <div style={{ marginTop: 10, fontSize: '0.66rem', color: '#8b949e', lineHeight: 1.7 }}>
              {dependencies.notes}
            </div>
          )}
        </Card>

        {/* CODE QUALITY */}
        <Card title="CODE QUALITY" icon="◈" color="#58a6ff" delay={630}>
          <BigScore score={code_quality?.score || 0} color={qColor} />
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              { label: 'TESTS', val: code_quality?.has_tests },
              { label: 'CI/CD', val: code_quality?.has_ci },
              { label: 'DOCS', val: code_quality?.has_docs },
            ].map(({ label, val }) => (
              <Badge key={label} text={label} variant={val ? 'success' : 'default'} />
            ))}
          </div>
          {code_quality?.insights?.slice(0, 5).map((insight, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid #21262d' }}>
              <span style={{ color: '#58a6ff', fontSize: '0.68rem' }}>◈</span>
              <span style={{ fontSize: '0.67rem', color: '#8b949e', lineHeight: 1.68, flex: 1 }}>
                {typeof insight === 'string' ? insight : insight.text || insight.description || insight}
              </span>
            </div>
          ))}
        </Card>

        {/* HERMES VERDICT */}
        <Card title="HERMES-4-70B AGENT VERDICT" icon="◉" color="#3fb950" delay={750}>
          <div style={{
            padding: '16px', background: '#0d1117', borderRadius: 6,
            border: '1px solid #3fb95025', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 18px, #3fb95006 18px, #3fb95006 19px)',
              pointerEvents: 'none',
            }} />
            <div style={{ fontSize: '0.7rem', color: '#3fb950', lineHeight: 1.85, fontStyle: 'italic', position: 'relative' }}>
              <span style={{ color: '#3fb95060', fontSize: '1.4rem', lineHeight: 0.5, verticalAlign: 'sub' }}>"</span>
              {agent_verdict}
              <span style={{ color: '#3fb95060', fontSize: '1.4rem', lineHeight: 0.5, verticalAlign: 'sub' }}>"</span>
            </div>
            <div style={{ marginTop: 12, fontSize: '0.58rem', color: '#484f58', letterSpacing: '0.15em' }}>
              — REPOSPECTRE / HERMES-4-70B · NOUS RESEARCH
            </div>
          </div>
          {meta && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge text={`MODEL: ${meta.model}`} variant="success" style={{ fontSize: '0.55rem' }} />
              <Badge text={`FILES: ${meta.files_scanned}`} variant="default" style={{ fontSize: '0.55rem' }} />
              <Badge text={new Date(meta.analyzed_at).toLocaleTimeString()} variant="default" style={{ fontSize: '0.55rem' }} />
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
