/**
 * AgentsHistoryView: Main UI component for agent management and history
 * Displays registered agents, session history, compilation logs, search, and export
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'

// ============================================================================
// Types
// ============================================================================

interface AgentInfo {
  agentId: string
  displayName: string
  type: 'contextual' | 'local' | 'remote' | 'extension'
  connected: boolean
  status: {
    state: 'connected' | 'error' | 'unknown'
    message?: string
    lastSync?: string
  }
}

interface SessionRecord {
  sessionId: string
  timestamp: string
  query: string
  duration: number
  status: 'success' | 'error' | 'pending'
  tokensSaved?: number
  error?: string
}

interface LogRecord {
  id: string
  timestamp: string
  query: string
  tokensBefore: number
  tokensAfter: number
  savingsPercent: number
  selectedSlices: string[]
  decisions: Array<{
    rule: string
    action: string
    reason: string
    impact?: number
  }>
  duration: number
  status: 'success' | 'error'
  error?: string
}

interface Metrics {
  totalCompilations: number
  totalTokensSaved: number
  totalSessions: number
  averageSavingsPercent: number
  agentCount: number
}

// ============================================================================
// Styles (Inline)
// ============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    fontSize: '12px',
    fontFamily: 'Menlo, Consolas, monospace',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #3e3e3e',
    backgroundColor: '#252526',
  },
  tab: (active: boolean) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    borderBottom: active ? '2px solid #007acc' : 'none',
    backgroundColor: active ? '#1e1e1e' : '#252526',
    color: active ? '#007acc' : '#858585',
    transition: 'all 0.2s',
  }),
  content: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  panel: {
    flex: 1,
    overflow: 'auto',
    padding: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderBottom: '1px solid #3e3e3e',
    backgroundColor: '#252526',
  },
  title: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  button: {
    padding: '4px 12px',
    backgroundColor: '#007acc',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '11px',
    marginLeft: '8px',
  },
  agentCard: {
    padding: '12px',
    backgroundColor: '#252526',
    border: '1px solid #3e3e3e',
    borderRadius: '4px',
    marginBottom: '8px',
    transition: 'all 0.2s',
  },
  agentCardHover: {
    backgroundColor: '#2d2d2d',
    borderColor: '#007acc',
  },
  statusIndicator: (connected: boolean) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: connected ? '#4ec9b0' : '#f48771',
    marginRight: '6px',
  }),
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: color,
    color: '#fff',
    borderRadius: '2px',
    fontSize: '10px',
    marginRight: '4px',
  }),
  logRow: {
    padding: '8px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #3e3e3e',
    borderRadius: '2px',
    marginBottom: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logRowHover: {
    backgroundColor: '#252526',
    borderColor: '#007acc',
  },
  searchBox: {
    width: '100%',
    padding: '6px 8px',
    backgroundColor: '#3e3e3e',
    color: '#e0e0e0',
    border: '1px solid #555',
    borderRadius: '2px',
    marginBottom: '8px',
    fontSize: '11px',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px',
    marginBottom: '16px',
  },
  metricCard: {
    padding: '12px',
    backgroundColor: '#252526',
    border: '1px solid #3e3e3e',
    borderRadius: '4px',
    textAlign: 'center' as const,
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007acc',
    marginBottom: '4px',
  },
  metricLabel: {
    fontSize: '10px',
    color: '#858585',
    textTransform: 'uppercase' as const,
  },
}

// ============================================================================
// Component: AgentCard
// ============================================================================

interface AgentCardProps {
  agent: AgentInfo
  onSelect: (agentId: string) => void
  selected: boolean
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, selected }) => {
  const [hovered, setHovered] = useState(false)

  const typeColors: Record<string, string> = {
    contextual: '#c586c0',
    local: '#4ec9b0',
    remote: '#569cd6',
    extension: '#dcdcaa',
  }

  return (
    <div
      style={{
        ...styles.agentCard,
        ...(hovered && styles.agentCardHover),
        borderLeft: selected ? '3px solid #007acc' : '3px solid transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(agent.agentId)}
    >
      <div style={styles.row}>
        <div>
          <span style={styles.statusIndicator(agent.connected)} />
          <strong>{agent.displayName}</strong>
          <span style={styles.badge(typeColors[agent.type])}>
            {agent.type}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#858585', marginTop: '4px' }}>
        {agent.status.message || agent.status.state}
      </div>
    </div>
  )
}

// ============================================================================
// Component: LogViewer
// ============================================================================

interface LogViewerProps {
  log: LogRecord
}

const LogViewer: React.FC<LogViewerProps> = ({ log }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={styles.logRow} onClick={() => setExpanded(!expanded)}>
      <div style={styles.row}>
        <div>
          <strong>{log.query.slice(0, 50)}</strong>
          {log.query.length > 50 && '...'}
        </div>
        <div>
          <span style={styles.badge(log.status === 'success' ? '#4ec9b0' : '#f48771')}>
            {log.status}
          </span>
          <span style={{ marginLeft: '8px', color: '#007acc', fontWeight: 'bold' }}>
            {log.savingsPercent}%
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #3e3e3e' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong>Tokens:</strong> {log.tokensBefore} → {log.tokensAfter} ({log.tokensBefore - log.tokensAfter} saved)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Duration:</strong> {log.duration}ms
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Files:</strong> {log.selectedSlices.join(', ') || 'none'}
          </div>
          {log.decisions.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Decisions:</strong>
              {log.decisions.map((d, i) => (
                <div key={i} style={{ marginLeft: '8px', fontSize: '10px' }}>
                  • {d.rule}: {d.action} ({d.reason})
                </div>
              ))}
            </div>
          )}
          {log.error && (
            <div style={{ color: '#f48771', marginBottom: '4px' }}>
              <strong>Error:</strong> {log.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Component: MetricsDisplay
// ============================================================================

interface MetricsDisplayProps {
  metrics: Metrics
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  return (
    <div style={styles.metrics}>
      <div style={styles.metricCard}>
        <div style={styles.metricValue}>{metrics.totalCompilations}</div>
        <div style={styles.metricLabel}>Compilations</div>
      </div>
      <div style={styles.metricCard}>
        <div style={styles.metricValue}>{metrics.totalTokensSaved}</div>
        <div style={styles.metricLabel}>Tokens Saved</div>
      </div>
      <div style={styles.metricCard}>
        <div style={styles.metricValue}>{metrics.averageSavingsPercent}%</div>
        <div style={styles.metricLabel}>Avg Savings</div>
      </div>
      <div style={styles.metricCard}>
        <div style={styles.metricValue}>{metrics.totalSessions}</div>
        <div style={styles.metricLabel}>Sessions</div>
      </div>
      <div style={styles.metricCard}>
        <div style={styles.metricValue}>{metrics.agentCount}</div>
        <div style={styles.metricLabel}>Agents Active</div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const AgentsHistoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'history' | 'logs' | 'ledger'>('agents')
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [history, setHistory] = useState<SessionRecord[]>([])
  const [logs, setLogs] = useState<LogRecord[]>([])
  const [ledgerEntries, setLedgerEntries] = useState<Array<{ id: string; summary: string; action: string; actor: { agentId?: string }; timestamp: string }>>([])
  const [ledgerAgentFilter, setLedgerAgentFilter] = useState('')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch agents list
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const resp = await fetch('http://localhost:19991/api/agents/list')
        const data = await resp.json()
        setAgents(data.agents || [])

        if (data.agents?.length > 0) {
          setSelectedAgent(data.agents[0].agentId)
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch agents:', err)
        setLoading(false)
      }
    }

    fetchAgents()
    const interval = setInterval(fetchAgents, 5000) // Refresh every 5s

    return () => clearInterval(interval)
  }, [])

  // Fetch metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const resp = await fetch('http://localhost:19991/api/agents/metrics/summary')
        const data = await resp.json()
        setMetrics(data.metrics)
      } catch (err) {
        console.error('Failed to fetch metrics:', err)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch history for selected agent
  useEffect(() => {
    if (!selectedAgent) return

    const fetchHistory = async () => {
      try {
        const resp = await fetch(
          `http://localhost:19991/api/agents/${selectedAgent}/history?limit=50`
        )
        const data = await resp.json()
        setHistory(data.sessions || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      }
    }

    fetchHistory()
    const interval = setInterval(fetchHistory, 5000)

    return () => clearInterval(interval)
  }, [selectedAgent])

  // Fetch logs for selected agent
  useEffect(() => {
    if (!selectedAgent) return

    const fetchLogs = async () => {
      try {
        const resp = await fetch(
          `http://localhost:19991/api/agents/${selectedAgent}/logs?limit=100&search=${encodeURIComponent(searchQuery)}`
        )
        const data = await resp.json()
        setLogs(data.logs || [])
      } catch (err) {
        console.error('Failed to fetch logs:', err)
      }
    }

    fetchLogs()
  }, [selectedAgent, searchQuery])

  useEffect(() => {
    if (activeTab !== 'ledger') return

    const fetchLedger = async () => {
      try {
        const params = new URLSearchParams({ limit: '100' })
        if (ledgerAgentFilter) params.set('agentId', ledgerAgentFilter)
        const resp = await fetch(`http://localhost:19991/api/ledger/filter?${params.toString()}`)
        const data = await resp.json()
        setLedgerEntries(data.entries || [])
      } catch (err) {
        console.error('Failed to fetch ledger:', err)
      }
    }

    fetchLedger()
    const interval = setInterval(fetchLedger, 8000)
    return () => clearInterval(interval)
  }, [activeTab, ledgerAgentFilter])

  // Export logs
  const handleExport = useCallback(() => {
    const json = JSON.stringify(logs, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${selectedAgent}-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [logs, selectedAgent])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.panel}>Loading agents...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabs}>
        {(['agents', 'history', 'logs', 'ledger'] as const).map((tab) => (
          <button
            key={tab}
            style={styles.tab(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div style={styles.panel}>
            <div style={styles.header}>
              <span style={styles.title}>Detected & Registered Agents</span>
            </div>

            {metrics && <MetricsDisplay metrics={metrics} />}

            <div style={{ marginTop: '16px' }}>
              {agents.length === 0 ? (
                <div style={{ color: '#858585' }}>No agents detected</div>
              ) : (
                agents.map((agent) => (
                  <AgentCard
                    key={agent.agentId}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    selected={selectedAgent === agent.agentId}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={styles.panel}>
            <div style={styles.header}>
              <span style={styles.title}>
                Session History ({selectedAgent || 'No agent selected'})
              </span>
            </div>

            <div style={{ marginTop: '12px' }}>
              {history.length === 0 ? (
                <div style={{ color: '#858585' }}>No sessions yet</div>
              ) : (
                history.map((session) => (
                  <div key={session.sessionId} style={styles.logRow}>
                    <div>{new Date(session.timestamp).toLocaleString()}</div>
                    <div>{session.query}</div>
                    <div style={{ color: '#007acc' }}>
                      {session.tokensSaved && `${session.tokensSaved} tokens saved`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div style={styles.panel}>
            <div style={styles.header}>
              <span style={styles.title}>
                Compilation Logs ({selectedAgent || 'No agent selected'})
              </span>
              <button style={styles.button} onClick={handleExport}>
                Export
              </button>
            </div>

            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBox}
            />

            <div style={{ marginTop: '12px' }}>
              {logs.length === 0 ? (
                <div style={{ color: '#858585' }}>No logs found</div>
              ) : (
                logs.map((log) => <LogViewer key={log.id} log={log} />)
              )}
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div style={styles.panel}>
            <div style={styles.header}>
              <span style={styles.title}>Execution Ledger</span>
            </div>
            <input
              type="text"
              placeholder="Filter by agentId..."
              value={ledgerAgentFilter}
              onChange={(e) => setLedgerAgentFilter(e.target.value)}
              style={styles.searchBox}
            />
            <div style={{ marginTop: '12px' }}>
              {ledgerEntries.length === 0 ? (
                <div style={{ color: '#858585' }}>No ledger entries</div>
              ) : (
                ledgerEntries.map((entry) => (
                  <div key={entry.id} style={styles.logRow}>
                    <div>{new Date(entry.timestamp).toLocaleString()}</div>
                    <div>{entry.action} — {entry.summary}</div>
                    <div style={{ color: '#007acc' }}>{entry.actor?.agentId || 'system'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentsHistoryView
