const NOUS_API_BASE = 'https://openrouter.ai/api/v1'
const MODEL = 'nousresearch/hermes-3-llama-3.1-70b'  // Hermes via OpenRouter

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
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  const start = txt.indexOf('{')
  const end = txt.lastIndexOf('}')
  if (start < 0 || end < 0) throw new Error('Hermes did not return valid JSON')
  return JSON.parse(txt.slice(start, end + 1))
}

export const ANALYSIS_SYSTEM_PROMPT = `You are RepoSpectre...` // tetap sama
