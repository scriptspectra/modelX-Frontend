"use client"

import React, { useEffect, useState } from 'react'

type StabilityData = {
  composite_score?: number
  category_scores?: Record<string, number>
  top_keywords?: string[]
  last_updated?: string
}

export default function KeywordRealtime() {
  const [data, setData] = useState<StabilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchOnce() {
    try {
      setLoading(true)
      const res = await fetch('/api/stability')
      if (!res.ok) throw new Error(`status ${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (err: any) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  // Poll every 5 minutes (300000 ms). Change `POLL_INTERVAL_MS` to adjust.
  const POLL_INTERVAL_MS = 5 * 60 * 1000

  useEffect(() => {
    fetchOnce()
    const id = setInterval(fetchOnce, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  if (loading && !data) return <div>Loading stability snapshot…</div>
  if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>

  const composite = data?.composite_score ?? null
  const categories = data?.category_scores ?? {}
  const keywords = data?.top_keywords ?? []

  return (
    <div style={{ padding: 12 }}>
      <h2>Real-time Keyword Analysis</h2>
      <div style={{ marginBottom: 8 }}>
        <strong>Composite score:</strong>{' '}
        {composite !== null ? composite.toFixed(2) : '—'}
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <h3>Category Scores</h3>
          <ul>
            {Object.entries(categories).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {Number(v).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Top Keywords</h3>
          <ol>
            {keywords.map((kw) => (
              <li key={kw}>{kw}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
