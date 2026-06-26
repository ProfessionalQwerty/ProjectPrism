/**
 * Team org / invite API client.
 */
import { apiClient } from '../api-config'

export interface CloudProject {
  id: string
  name: string
  repository_url: string | null
  role: string
  legacy_path_hash: string | null
}

export async function createTeam(name: string): Promise<{ id: string; slug: string }> {
  const res = await apiClient.post<{ success: boolean; org: { id: string; slug: string } }>(
    '/api/orgs',
    { name }
  )
  return res.org
}

export async function createTeamInvite(orgId: string, role = 'member'): Promise<{ token: string; inviteUrl: string }> {
  const res = await apiClient.post<{
    success: boolean
    invite: { token: string }
    inviteUrl: string
  }>(`/api/orgs/${orgId}/invites`, { role })
  return { token: res.invite.token, inviteUrl: res.inviteUrl }
}

export async function redeemInvite(token: string): Promise<void> {
  await apiClient.post(`/api/invites/${encodeURIComponent(token)}/redeem`, {})
}

export async function listCloudProjects(): Promise<CloudProject[]> {
  const res = await apiClient.get<{ success: boolean; cloudProjects: CloudProject[] }>(
    '/api/projects/cloud'
  )
  return res.cloudProjects || []
}

export async function listLiveSessions(projectId: string): Promise<
  Array<{ id: string; title: string; status: string; updated_at: string }>
> {
  const res = await apiClient.get<{ success: boolean; sessions: Array<{ id: string; title: string; status: string; updated_at: string }> }>(
    `/api/projects/${projectId}/sessions`
  )
  return res.sessions || []
}

export async function joinSession(projectId: string, sessionId: string): Promise<void> {
  await apiClient.post(`/api/projects/${projectId}/sessions/${sessionId}/join`, {})
}

export async function createCollaborationSession(
  projectId: string,
  sessionId: string,
  title?: string
): Promise<void> {
  await apiClient.post(`/api/projects/${projectId}/sessions`, { sessionId, title })
}

export async function heartbeatSessionPresence(projectId: string, sessionId: string): Promise<
  Array<{ user_id: string; last_seen_at: string }>
> {
  const res = await apiClient.post<{
    success: boolean
    participants: Array<{ user_id: string; last_seen_at: string }>
  }>(`/api/projects/${projectId}/sessions/${sessionId}/presence`, {})
  return res.participants || []
}

export async function setTelemetryOptInRemote(enabled: boolean): Promise<boolean> {
  const res = await apiClient.post<{ success: boolean; optedIn: boolean }>('/api/telemetry/opt-in', {
    enabled,
  })
  return res.optedIn
}

export async function fetchTelemetryStatus(): Promise<boolean> {
  const res = await apiClient.get<{ success: boolean; optedIn: boolean }>('/api/telemetry/status')
  return res.optedIn
}
