export function getProjectAgentIds(projectId: string | null): string[] {
  if (!projectId) return []
  try {
    const raw = localStorage.getItem(`prism-agents-${projectId}`)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function addProjectAgentId(projectId: string, agentId: string): void {
  const ids = [...new Set([...getProjectAgentIds(projectId), agentId])]
  localStorage.setItem(`prism-agents-${projectId}`, JSON.stringify(ids))
}

export function removeProjectAgentId(projectId: string, agentId: string): void {
  const ids = getProjectAgentIds(projectId).filter((id) => id !== agentId)
  localStorage.setItem(`prism-agents-${projectId}`, JSON.stringify(ids))
}
