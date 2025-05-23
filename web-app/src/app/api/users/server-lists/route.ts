import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { fetchServerMetrics, determineHealthStatus } from '@/app/utils/fetchServerMetrics'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const includeHealth = searchParams.get('include_health') === 'true'
  
  try {
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    if (includeHealth) {
      const serversWithHealth = await Promise.all(
        data.map(async (server) => {
          const metrics = await fetchServerMetrics(server.address)
          return {
            ...server,
            health: {
              cpu: metrics.cpu,
              memory: metrics.memory,
              disk: metrics.disk,
              status: determineHealthStatus(metrics)
            }
          }
        })
      )
      return NextResponse.json(serversWithHealth)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { name, address } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('servers')
      .insert([{ name, address, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { id } = await request.json()
    const { error } = await supabase
      .from('servers')
      .delete()
      .match({ id })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete server' },
      { status: 500 }
    )
  }
}