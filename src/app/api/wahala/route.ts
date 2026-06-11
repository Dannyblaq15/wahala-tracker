import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Sentiment from 'sentiment'
import { adminAuth } from '@/lib/firebaseAdmin'
import { rateLimit } from '@/lib/rateLimit'

const sentiment = new Sentiment()

async function getAuthUid() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return null
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decodedClaims.uid
  } catch (error) {
    return null
  }
}

export async function POST(request: Request) {
  // Rate limit: Max 15 posts per minute per IP
  const rateLimitResponse = rateLimit(request, { limit: 15, windowMs: 60000 });
  if (rateLimitResponse) return rateLimitResponse;

  const uid = await getAuthUid()
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
        category: category || 'General',
        user_id: uid
      }
    ])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function GET() {
  const uid = await getAuthUid()
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    .eq('user_id', uid)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
