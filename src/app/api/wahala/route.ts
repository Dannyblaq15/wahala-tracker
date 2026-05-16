import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Sentiment from 'sentiment'


const sentiment = new Sentiment()

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const body = await request.json()
  const { title, description, severity, category } = body

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  // Sentiment Analysis
  const analysis = sentiment.analyze(description || title)
  let mood = 'neutral'
  if (analysis.score > 2) mood = 'happy'
  else if (analysis.score < -2) mood = 'angry'
  else if (analysis.score < 0) mood = 'stressed'
  else if (analysis.score > 0) mood = 'vibrant'

  const parsedSeverity = parseInt(severity) || 3

  const { data, error } = await supabase
    .from('wahalas')
    .insert([
      {
        title,
        description: description || '',
        severity: Math.min(5, Math.max(1, parsedSeverity)),
        mood,
        category: category || 'General'
      }
    ])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('wahalas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
