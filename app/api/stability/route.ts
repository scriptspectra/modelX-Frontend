import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/stability/current`, {
      // ensure we don't cache server-side proxy responses
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: 'upstream error', details: txt }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: 'proxy failed', message: String(err) }, { status: 500 })
  }
}
