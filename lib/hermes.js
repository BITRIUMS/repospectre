const NOUS_API_BASE = 'https://openrouter.ai/api/v1'
const MODEL = 'nousresearch/hermes-3-llama-3.1-70b'

export async function callHermes({ system, user, maxTokens = 2048, temperature = 0.3 }) {
  const apiKey = process.env.NOUS_API_KEY
  if (!apiKey) throw new Error('NOUS_API_KEY is not set in environment variables')

  const res = await fetch(`${NOUS_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://repospectre.vercel.app',
      'X-Title': 'RepoSpectre',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Hermes API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export function parseHermesJSON(raw) {
  let txt = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const start = txt.indexOf('{')
  const end = txt.lastIndexOf('}')
  if (start < 0 || end < 0) throw new Error('Hermes did not return valid JSON')
  return JSON.parse(txt.slice(start, end + 1))
}

export const ANALYSIS_SYSTEM_PROMPT = `You are RepoSpectre, an elite AI repository intelligence agent powered by Hermes-4-70B from Nous Research. You analyze GitHub repositories with surgical precision and deep technical expertise.
Your analysis must be thorough, accurate, and actionable. Identify real security risks, actual dependency patterns, and genuine code quality signals from the provided data.
CRITICAL: Respond ONLY with a valid JSON object. Zero markdown. Zero preamble. Zero explanation outside the JSON braces.
Required JSON structure:
{
  "overview": {
    "summary": "2-3 sentence expert summary covering purpose, maturity, and notable characteristics",
    "health_score": <integer 0-100>,
    "risk_level": "low|medium|high|critical",
    "key_findings": ["finding 1", "finding 2", "finding 3", "finding 4", "finding 5"]
  },
  "security": {
    "score": <integer 0-100>,
    "issues": [
      { "severity": "critical|high|medium|low|info", "description": "specific actionable issue" }
    ],
    "recommendations": ["specific rec 1", "specific rec 2", "specific rec 3"]
  },
  "dll_scan": {
    "verdict": "clean|suspicious|malicious",
    "found": [
      { "name": "path/file.dll", "type": "dll|exe|bin|so", "suspicious": true }
    ],
    "suspicious": ["list of suspicious paths"],
    "analysis": "Brief technical analysis of any binaries found, or confirmation of clean state"
  },
  "dependencies": {
    "total": <integer>,
    "outdated": <integer estimate>,
    "vulnerable": <integer estimate>,
    "ecosystem": "npm|python|go|rust|ruby|java|php|other|none",
    "details": [
      { "name": "package-name", "version": "x.x.x", "status": "ok|outdated|vulnerable" }
    ],
    "notes": "Key observations about dependency management"
  },
  "code_quality": {
    "score": <integer 0-100>,
    "has_tests": true,
    "has_ci": true,
    "has_docs": true,
    "insights": [
      "specific insight about code organization",
      "specific insight about testing strategy",
      "specific insight about documentation",
      "specific insight about CI/CD setup",
      "specific insight about project maintainability"
    ]
  },
  "agent_verdict": "2-3 sentence authoritative RepoSpectre verdict covering overall health, the most important risk, and a concrete recommendation for developers."
}`
