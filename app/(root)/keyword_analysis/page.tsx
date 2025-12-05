import KeywordRealtime from './KeywordRealtime'

export const metadata = {
  title: 'Keyword Analysis',
}

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Keyword Analysis</h1>
      <p>Live snapshot of stability keyword analysis (updates every 5s)</p>
      <KeywordRealtime />
    </main>
  )
}
