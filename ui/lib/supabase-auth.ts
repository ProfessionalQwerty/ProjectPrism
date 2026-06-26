/**
 * Supabase Auth — GitHub primary (PKCE / OAuth redirect).
 */
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''
const SESSION_KEY = 'prism-supabase-session'

let client: SupabaseClient | null = null

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseAuthConfigured()) return null
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        storageKey: SESSION_KEY,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

export async function signInWithGitHub(): Promise<void> {
  const sb = getSupabaseClient()
  if (!sb) throw new Error('Supabase not configured (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)')

  const redirectTo =
    import.meta.env.VITE_SUPABASE_REDIRECT_URL?.trim() ||
    `${window.location.origin}${window.location.pathname}`

  const { error } = await sb.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo, skipBrowserRedirect: false },
  })
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const sb = getSupabaseClient()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return session?.access_token || null
}

export async function signOut(): Promise<void> {
  const sb = getSupabaseClient()
  if (sb) await sb.auth.signOut()
}

export interface PrismAuthUser {
  id: string
  email?: string
  githubLogin?: string
  avatarUrl?: string
}

export async function getCurrentUser(): Promise<PrismAuthUser | null> {
  const sb = getSupabaseClient()
  if (!sb) return null
  const { data } = await sb.auth.getUser()
  const u = data.user
  if (!u) return null
  const meta = u.user_metadata || {}
  return {
    id: u.id,
    email: u.email,
    githubLogin: meta.user_name || meta.preferred_username,
    avatarUrl: meta.avatar_url,
  }
}

export function onAuthStateChange(cb: (session: Session | null) => void): (() => void) | null {
  const sb = getSupabaseClient()
  if (!sb) return null
  const { data } = sb.auth.onAuthStateChange((_event, session) => cb(session))
  return () => data.subscription.unsubscribe()
}
