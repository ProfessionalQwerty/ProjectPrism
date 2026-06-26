export const TELEMETRY_CONSENT_KEY = 'prism-intelligence-engine-opt-in'

export function isTelemetryOptedIn(): boolean {
  try {
    return localStorage.getItem(TELEMETRY_CONSENT_KEY) === '1'
  } catch {
    return false
  }
}

export function setTelemetryOptIn(enabled: boolean): void {
  localStorage.setItem(TELEMETRY_CONSENT_KEY, enabled ? '1' : '0')
}
