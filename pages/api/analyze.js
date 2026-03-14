import {
  parseRepoUrl, fetchRepoMeta, fetchFileTree,
  fetchDependencyContext, detectBinaries,
  computeExtStats, fetchContributors,
} from '../../lib/github'

import {
  callHermes, parseHermesJSON, ANALYSIS_SYSTEM_PROMPT,
} from '../../lib/hermes'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { repoUrl } = req.body
  if (!repoUrl?.trim()) return res.status(400).json({ error: 'repoUrl is required' })
  if (!process.env.NOUS_API_KEY) return res.status(500).json({ error: 'NOUS_API_KEY not configured in Vercel environment variables' })

  try {
    const { owner, repo } = parseRepoUrl(repoUrl)
    const repoMeta = await fetchRepoMeta(owner, repo)
    const files = await fetchFileTree(owner, repo)
    const binaryScan = detectBinaries(files)
    const depContext = await fetchDependencyContext(owner, repo, files)
    const extStats = computeExtStats(files)
    const contributors = await fetchContributors(owner, repo)
    const filePaths = files.map(f => f.path)
    const hasCI = filePaths.some(p => p.includes('.github/workflows')) || filePaths.includes('.travis.yml') || filePaths.includes('Jenkinsfile')
    const hasTests = filePaths.some(p => p.includes('/test/') || p.includes('/tests/') || p.includes('.spec.') || p.includes('.test.'))
    const hasReadme = filePaths.some(p => p.toLowerCase() === 'readme.md')
    const hasLicense = filePaths.some(p => p.toLowerCase().startsWith('license'))
    const hasDockerfile = filePaths.some(p => p.toLowerCase().includes('dockerfile'))

    const context = {
      repository: {
        name: repoMeta.name, full_name: repoMeta.full_name,
        description: repoMeta.description, primary_language: repoMeta.language,
        stars: repoMeta.stargazers_count, forks: repoMeta.forks_count,
        open_issues: repoMeta.open_issues_count, size_kb: repoMeta.size,
        default_branch: repoMeta.default_branch, topics: repoMeta.topics || [],
        license: repoMeta.license?.spdx_id || null, visibility: repoMeta.visibility,
        is_fork: repoMeta.fork, is_archived: repoMeta.archived,
        created_at: repoMeta.created_at, last_push: repoMeta.pushed_at,
        contributor_count: contributors.length,
      },
      file_analysis: {
        total_files: files.length, extension_breakdown: extStats,
        root_level_files: files.filter(f => !f.path.includes('/')).map(f => f.path).slice(0, 25),
        detected_structure: { has_ci_cd: hasCI, has_tests: hasTests, has_readme: hasReadme, has_license: hasLicense, has_dockerfile: hasDockerfile },
      },
      binary_scan: {
        total_found: binaryScan.found.length,
        files: binaryScan.found.map(f => f.name).slice(0, 25),
        suspicious: binaryScan.suspicious.slice(0, 10),
      },
      dependencies: depContext,
    }

    const rawResponse = await callHermes({
      system: ANALYSIS_SYSTEM_PROMPT,
      user: `Analyze this GitHub repository:\n\n${JSON.stringify(context, null, 2)}`,
      maxTokens: 2500, temperature: 0.25,
    })

    const analysis = parseHermesJSON(rawResponse)

    if (binaryScan.found.length > 0 && !analysis.dll_scan?.found?.length) {
      analysis.dll_scan = {
        verdict: binaryScan.suspicious.length > 0 ? 'suspicious' : 'clean',
        found: binaryScan.found, suspicious: binaryScan.suspicious,
        analysis: analysis.dll_scan?.analysis || 'Binary files detected.',
      }
    }

    return res.status(200).json({
      ...analysis,
      repo_info: {
        name: repoMeta.name, full_name: repoMeta.full_name,
        description: repoMeta.description, language: repoMeta.language,
        stars: repoMeta.stargazers_count, forks: repoMeta.forks_count,
        open_issues: repoMeta.open_issues_count, size: repoMeta.size,
        topics: repoMeta.topics || [], license: repoMeta.license?.spdx_id || null,
        default_branch: repoMeta.default_branch, last_push: repoMeta.pushed_at,
        created_at: repoMeta.created_at, contributors: contributors.length,
        has_ci: hasCI, has_tests: hasTests,
      },
      meta: {
        model: 'Hermes-4-70B', provider: 'Nous Research',
        analyzed_at: new Date().toISOString(), files_scanned: files.length,
      },
    })
  } catch (err) {
    console.error('[RepoSpectre]', err.message)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
