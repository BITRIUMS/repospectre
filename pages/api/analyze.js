/**
 * RepoSpectre — AI Repository Analysis API
 * Uses GitHub REST API + Hermes-3-70B via OpenRouter
 */

const HERMES_MODEL = 'nousresearch/hermes-3-llama-3.1-70b';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

async function fetchGitHub(path, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoSpectre/1.0',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
  return res.json();
}

function parseRepoUrl(url) {
  const match = url.match(/github\.com\/([^/\s]+)\/([^/\s]+)/);
  if (!match) throw new Error('Invalid GitHub repository URL');
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

function detectBinaries(files) {
  const binaryExts = ['.dll', '.exe', '.bin', '.so', '.dylib', '.pyd', '.pyc', '.class', '.jar', '.war', '.ear'];
  const suspiciousExts = ['.dll', '.exe', '.bin'];
  const found = [];
  const suspicious = [];
  for (const file of files) {
    const lower = file.path.toLowerCase();
    const ext = '.' + lower.split('.').pop();
    if (binaryExts.some(e => lower.endsWith(e))) {
      found.push({ name: file.path, type: ext.slice(1), suspicious: suspiciousExts.includes(ext) });
      if (suspiciousExts.includes(ext)) suspicious.push(file.path);
    }
  }
  return { found, suspicious };
}

async function fetchDependencies(owner, repo, token) {
  const depFiles = ['package.json', 'requirements.txt', 'Gemfile', 'go.mod', 'pom.xml', 'build.gradle', 'Cargo.toml'];
  const found = {};
  for (const file of depFiles) {
    try {
      const data = await fetchGitHub(`/repos/${owner}/${repo}/contents/${file}`, token);
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      if (file === 'package.json') {
        const pkg = JSON.parse(content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        found.npm = Object.entries(deps).slice(0, 30).map(([name, version]) => ({ name, version }));
      } else if (file === 'requirements.txt') {
        found.python = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 30).map(l => l.trim());
      } else {
        found[file] = content.slice(0, 500);
      }
    } catch {
      // file doesn't exist, skip
    }
  }
  return found;
}

async function callHermes(apiKey, prompt, systemPrompt) {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://repospectre.vercel.app',
      'X-Title': 'RepoSpectre',
    },
    body: JSON.stringify({
      model: HERMES_MODEL,
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `Hermes API error: ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoUrl, apiKey } = req.body;

  if (!repoUrl || !apiKey) {
    return res.status(400).json({ error: 'repoUrl and apiKey are required' });
  }

  const githubToken = process.env.GITHUB_TOKEN || null;

  try {
    const { owner, repo } = parseRepoUrl(repoUrl);

    // 1. Fetch repo info
    const repoData = await fetchGitHub(`/repos/${owner}/${repo}`, githubToken);

    // 2. Fetch file tree
    let files = [];
    try {
      const tree = await fetchGitHub(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, githubToken);
      files = (tree.tree || []).filter(f => f.type === 'blob').slice(0, 500);
    } catch {
      // private or too large, skip
    }

    // 3. Detect binaries/DLLs
    const binaryScan = detectBinaries(files);

    // 4. Fetch dependencies
    const deps = await fetchDependencies(owner, repo, githubToken);

    // 5. Build file extension stats
    const extCounts = {};
    for (const f of files) {
      const ext = f.path.split('.').pop()?.toLowerCase() || 'none';
      extCounts[ext] = (extCounts[ext] || 0) + 1;
    }
    const topExts = Object.entries(extCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // 6. Prepare context for Hermes
    const context = {
      repo: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        size: repoData.size,
        topics: repoData.topics,
        license: repoData.license?.spdx_id,
        default_branch: repoData.default_branch,
        last_push: repoData.pushed_at,
        created_at: repoData.created_at,
        archived: repoData.archived,
        fork: repoData.fork,
        has_wiki: repoData.has_wiki,
        has_issues: repoData.has_issues,
        has_projects: repoData.has_projects,
        visibility: repoData.visibility,
        owner_type: repoData.owner?.type,
        network_count: repoData.network_count,
        watchers: repoData.watchers_count,
      },
      file_stats: {
        total_files: files.length,
        extension_breakdown: topExts,
        root_files: files.filter(f => !f.path.includes('/')).map(f => f.path).slice(0, 20),
      },
      binary_scan: {
        total_binaries: binaryScan.found.length,
        binary_files: binaryScan.found.map(f => f.name).slice(0, 20),
        suspicious_files: binaryScan.suspicious.slice(0, 10),
      },
      dependencies: deps,
    };

    const systemPrompt = `You are RepoSpectre, an elite AI repository intelligence agent. You analyze GitHub repositories with surgical precision, identifying security vulnerabilities, code quality issues, suspicious binary files (DLLs, EXEs), dependency vulnerabilities, and providing strategic intelligence.

You MUST respond with ONLY a valid JSON object, no markdown, no preamble, no explanation outside the JSON. The JSON must match this exact structure:

{
  "overview": {
    "summary": "2-3 sentence expert summary of the repository",
    "health_score": <0-100 integer>,
    "risk_level": "low" | "medium" | "high" | "critical",
    "key_findings": ["finding 1", "finding 2", "finding 3", "finding 4", "finding 5"]
  },
  "security": {
    "score": <0-100 integer>,
    "issues": [
      {"severity": "critical|high|medium|low|info", "description": "Issue description"}
    ],
    "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
  },
  "dll_scan": {
    "verdict": "clean" | "suspicious" | "malicious",
    "found": [
      {"name": "filename.dll", "type": "dll", "suspicious": true|false}
    ],
    "suspicious": ["list of suspicious file paths"],
    "analysis": "Brief analysis of binary files found"
  },
  "dependencies": {
    "total": <integer>,
    "outdated": <integer estimate>,
    "vulnerable": <integer estimate>,
    "details": [
      {"name": "dep-name", "version": "x.x.x", "status": "ok|outdated|vulnerable"}
    ],
    "ecosystem": "npm|python|ruby|go|other"
  },
  "code_quality": {
    "score": <0-100 integer>,
    "insights": [
      "Insight 1 about code organization",
      "Insight 2 about documentation",
      "Insight 3 about testing",
      "Insight 4 about CI/CD",
      "Insight 5 about project structure"
    ]
  },
  "agent_verdict": "A 2-3 sentence authoritative verdict from the RepoSpectre agent about the overall repository health, security posture, and recommendation."
}

Be precise, technical, and actionable. Base your analysis strictly on the provided repository data.`;

    const userPrompt = `Analyze this GitHub repository:

${JSON.stringify(context, null, 2)}

Provide a comprehensive analysis following the required JSON structure.`;

    // 7. Call Hermes
    let raw = await callHermes(apiKey, userPrompt, systemPrompt);

    // Clean response
    raw = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    // Find JSON boundaries
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Invalid response from Hermes agent');
    raw = raw.slice(start, end + 1);

    let analysis;
    try {
      analysis = JSON.parse(raw);
    } catch {
      throw new Error('Failed to parse Hermes response as JSON');
    }

    // 8. Merge with real binary scan data
    if (!analysis.dll_scan?.found?.length && binaryScan.found.length > 0) {
      analysis.dll_scan = {
        ...analysis.dll_scan,
        found: binaryScan.found,
        suspicious: binaryScan.suspicious,
        verdict: binaryScan.suspicious.length > 0 ? 'suspicious' : 'clean',
      };
    }

    // 9. Add repo_info to response
    const response = {
      ...analysis,
      repo_info: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        size: repoData.size,
        topics: repoData.topics,
        license: repoData.license?.spdx_id,
        default_branch: repoData.default_branch,
        last_push: repoData.pushed_at,
      },
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('RepoSpectre error:', error);
    return res.status(500).json({ error: error.message || 'Internal analysis error' });
  }
}
