import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { apiClient } from '../api-config'
import type { ChatMessage } from '../lib/chat-types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

function ledgerToChatMessage(data: Record<string, unknown>): ChatMessage | null {
  const action = String(data.action || '')
  const id = String(data.id || data.row_id || Math.random())
  if (action === 'user_prompt' && data.prompt) {
    return { id: `${id}-u`, role: 'user', content: String(data.prompt) }
  }
  if (action === 'response_recorded') {
    return {
      id: `${id}-a`,
      role: 'agent',
      content: String(data.reasoning_summary || data.summary || ''),
      detail: String(data.agent_id || ''),
    }
  }
  return null
}

/**
 * Tail ledger rows for a shared session via Supabase Realtime on ruby_sync_rows.
 */
export function useSessionRealtime(
  projectId: string | null,
  sessionId: string | null,
  enabled: boolean
) {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([])
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    if (!enabled || !projectId || !sessionId || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const channel = sb
      .channel(`ledger-${projectId}-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ruby_sync_rows',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const row = payload.new as { table_name?: string; data?: Record<string, unknown> }
          if (row.table_name !== 'ledger_entries') return
          const data = row.data || {}
          if (String(data.session_id) !== sessionId) return
          const msg = ledgerToChatMessage(data)
          if (msg) {
            setLiveMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev
              return [...prev, msg]
            })
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    void apiClient
      .get<{ success: boolean; ledger: { entries: Array<Record<string, unknown>> } }>(
        `/api/ledger?sessionId=${encodeURIComponent(sessionId)}&limit=50`
      )
      .then((res) => {
        const msgs: ChatMessage[] = []
        for (const entry of res.ledger?.entries || []) {
          const m = ledgerToChatMessage(entry)
          if (m) msgs.push(m)
        }
        setLiveMessages(msgs)
      })
      .catch(() => undefined)

    return () => {
      void sb.removeChannel(channel)
      channelRef.current = null
    }
  }, [projectId, sessionId, enabled])

  return liveMessages
}
