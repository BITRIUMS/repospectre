import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0d1117" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👁</text></svg>" />
        <meta property="og:title" content="RepoSpectre — AI Repository Intelligence Agent" />
        <meta property="og:description" content="Deep scan any GitHub repository with Hermes-4-70B AI. Security, DLL detection, dependency analysis." />
        <meta name="twitter:card" content="summary" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
