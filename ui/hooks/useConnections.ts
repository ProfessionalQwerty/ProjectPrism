import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api-config'
import { getDesktopAPI } from '../lib/desktop-bridge'

export interface ConnectionInfo {
  provider: string
  connected: boolean
  label: string
  account?: string
  repoFullName?: string
  projectId?: string
  updatedAt?: string
}

export interface ConnectionsState {
  github: ConnectionInfo
  vercel: ConnectionInfo
  engine: ConnectionInfo
}

export interface GitHubOAuthInfo {
  ready: boolean
  redirectUrl: string | null
  hint: string | null
}

export interface GitStatus {
  branch: string
  clean: boolean
  ahead: number
  behind: number
  changed: string[]
  untracked: string[]
  hasRepo: boolean
}

export interface PreviewSession {
  projectId: string
  command: string
  port: number
  url: string
  running: boolean
  logs: string[]
}

export function useConnections(apiOnline: boolean) {
  const [connections, setConnections] = useState<ConnectionsState | null>(null)
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)
  const [preview, setPreview] = useState<PreviewSession | null>(null)
  const [deployLog, setDeployLog] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [githubOAuth, setGithubOAuth] = useState<GitHubOAuthInfo | null>(null)
  const [needsProject, setNeedsProject] = useState(false)

  const refresh = useCallback(async () => {
    if (!apiOnline) return
    try {
      const res = await apiClient.get<{
        success: boolean
        connections: ConnectionsState
        githubOAuth?: GitHubOAuthInfo
        hasActiveProject?: boolean
      }>('/api/connections')
      setConnections(res.connections)
      setGithubOAuth(res.githubOAuth ?? null)
      setNeedsProject(!res.hasActiveProject)
      setError(null)

      try {
        const git = await apiClient.get<{
          success: boolean
          status: GitStatus
          needsProject?: boolean
        }>('/api/deploy/git-status')
        setGitStatus(git.status)
        if (git.needsProject) setNeedsProject(true)
      } catch {
        setGitStatus(null)
      }

      try {
        const prev = await apiClient.get<{
          success: boolean
          preview: PreviewSession | null
          needsProject?: boolean
        }>('/api/preview')
        setPreview(prev.preview)
        if (prev.needsProject) setNeedsProject(true)
      } catch {
        setPreview(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections')
    }
  }, [apiOnline])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const connectGitHub = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await apiClient.post<{ success: boolean; authorizeUrl: string }>(
        '/api/connections/github/start',
        {}
      )
      const api = getDesktopAPI()
      if (api?.openExternal) await api.openExternal(res.authorizeUrl)
      else window.open(res.authorizeUrl, '_blank', 'noopener,noreferrer')
      window.setTimeout(() => void refresh(), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub connect failed')
    } finally {
      setBusy(false)
    }
  }, [refresh])

  const connectVercel = useCallback(
    async (token: string) => {
      setBusy(true)
      setError(null)
      try {
        await apiClient.post('/api/connections/vercel/connect', { token })
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Vercel connect failed')
      } finally {
        setBusy(false)
      }
    },
    [refresh]
  )

  const disconnect = useCallback(
    async (provider: 'github' | 'vercel') => {
      setBusy(true)
      try {
        await apiClient.post(`/api/connections/${provider}/disconnect`, {})
        await refresh()
      } finally {
        setBusy(false)
      }
    },
    [refresh]
  )

  const deploy = useCallback(
    async (message?: string) => {
      setBusy(true)
      setError(null)
      setDeployLog('Committing and pushing…')
      try {
        const res = await apiClient.post<{
          success: boolean
          liveUrl?: string
          message?: string
          error?: string
        }>('/api/deploy', { message: message || 'Deploy from PRISM' })
        setDeployLog(res.liveUrl || res.message || 'Deploy complete')
        await refresh()
        return res
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Deploy failed'
        setError(msg)
        setDeployLog(msg)
        throw err
      } finally {
        setBusy(false)
      }
    },
    [refresh]
  )

  const startPreview = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await apiClient.post<{ success: boolean; preview: PreviewSession }>(
        '/api/preview/start',
        {}
      )
      setPreview(res.preview)
      const api = getDesktopAPI()
      if (api?.openExternal) await api.openExternal(res.preview.url)
      else window.open(res.preview.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed')
    } finally {
      setBusy(false)
    }
  }, [])

  const stopPreview = useCallback(async () => {
    setBusy(true)
    try {
      await apiClient.post('/api/preview/stop', {})
      setPreview(null)
    } finally {
      setBusy(false)
    }
  }, [])

  return {
    connections,
    gitStatus,
    preview,
    deployLog,
    busy,
    error,
    githubOAuth,
    needsProject,
    refresh,
    connectGitHub,
    connectVercel,
    disconnect,
    deploy,
    startPreview,
    stopPreview,
  }
}
