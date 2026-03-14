const GH_BASE = 'https://api.github.com'

async function ghFetch(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoSpectre/2.0',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(`${GH_BASE}${path}`, { headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error ${res.status}`)
  }
  return res.json()
}

export function parseRepoUrl(url) {
  const m = url.match(/github\.com\/([^/\s]+)\/([^/\s?#]+)/)
  if (!m) throw new Error('Invalid GitHub URL — format: github.com/owner/repo')
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

export async function fetchRepoMeta(owner, repo) {
  return ghFetch(`/repos/${owner}/${repo}`)
}

export async function fetchFileTree(owner, repo) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`)
    return (data.tree || []).filter(f => f.type === 'blob').slice(0, 600)
  } catch {
    return []
  }
}

export async function fetchFileContent(owner, repo, path) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/contents/${path}`)
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch {
    return null
  }
}

export async function fetchContributors(owner, repo) {
  try {
    return await ghFetch(`/repos/${owner}/${repo}/contributors?per_page=10`)
  } catch {
    return []
  }
}

export function detectBinaries(files) {
  const BINARY_EXTS = ['.dll', '.exe', '.bin', '.so', '.dylib', '.pyd', '.pyc', '.class', '.jar', '.war', '.ear', '.o', '.a']
  const SUSPICIOUS_EXTS = ['.dll', '.exe', '.bin']
  const found = []
  const suspicious = []
  for (const file of files) {
    const lower = file.path.toLowerCase()
    const ext = '.' + lower.split('.').pop()
    if (BINARY_EXTS.includes(ext)) {
      const isSuspicious = SUSPICIOUS_EXTS.includes(ext)
      found.push({ name: file.path, type: ext.slice(1), suspicious: isSuspicious })
      if (isSuspicious) suspicious.push(file.path)
    }
  }
  return { found, suspicious }
}

export async function fetchDependencyContext(owner, repo, files) {
  const DEP_FILES = [
    'package.json', 'requirements.txt', 'go.mod',
    'Cargo.toml', 'Gemfile', 'pom.xml', 'composer.json',
    'pyproject.toml', 'setup.py',
  ]
  const results = {}
  const found = files.map(f => f.path)
  for (const depFile of DEP_FILES) {
    const match = found.find(p => p === depFile || p.endsWith(`/${depFile}`))
    if (!match) continue
    const content = await fetchFileContent(owner, repo, match)
    if (!content) continue
    if (depFile === 'package.json') {
      try {
        const pkg = JSON.parse(content)
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }
        results.npm = {
          name: pkg.name,
          version: pkg.version,
          scripts: Object.keys(pkg.scripts || {}),
          deps: Object.entries(deps).slice(0, 40).map(([n, v]) => ({ name: n, version: v })),
          count: Object.keys(deps).length,
        }
      } catch { }
    } else if (depFile === 'requirements.txt') {
      results.python = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 40)
    } else if (depFile === 'go.mod') {
      results.go = content.slice(0, 800)
    } else if (depFile === 'Cargo.toml') {
      results.rust = content.slice(0, 800)
    }
  }
  return results
}

export function computeExtStats(files) {
  const counts = {}
  for (const f of files) {
    const ext = (f.path.split('.').pop() || 'none').toLowerCase()
    counts[ext] = (counts[ext] || 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12)
}
