/**
 * useAuth Hook
 * React hook for authentication state management
 */

import { useState, useEffect, useCallback } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface User {
  userId: string
  email: string
  displayName: string
  avatarUrl?: string
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
  lastActivityAt?: string
  promptsRemainingToday?: number
  promptsAllowedToday?: number
  resetTime?: string
}

export interface RateLimitStatus {
  promptsUsedToday: number
  promptsAllowed: number
  promptsRemaining: number
  resetTime: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  rateLimitStatus: RateLimitStatus | null
}

export interface UseAuthReturn extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  verifyEmail: (code: string) => Promise<void>
  getAuthHeader: () => { Authorization: string } | null
}

// ============================================================================
// Auth Hook
// ============================================================================

const STORAGE_KEY_TOKEN = 'auth_token'
const STORAGE_KEY_USER = 'auth_user'
const API_BASE = 'http://localhost:19991'
const POLL_INTERVAL = 30000 // 30 seconds

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    rateLimitStatus: null,
  })

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN)
      const userJson = localStorage.getItem(STORAGE_KEY_USER)

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson) as User
          setState((prev) => ({
            ...prev,
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          }))

          // Fetch fresh user data
          await refreshUserData(token)
        } catch (err) {
          console.error('[useAuth] Init error:', err)
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Failed to restore authentication',
          }))
        }
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }))
      }
    }

    initAuth()
  }, [])

  /**
   * Poll user data and rate limits
   */
  useEffect(() => {
    if (!state.isAuthenticated || !state.token) {
      return
    }

    const poll = async () => {
      try {
        await refreshUserData(state.token!)
      } catch (err) {
        console.error('[useAuth] Poll error:', err)
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [state.isAuthenticated, state.token])

  // ============================================================================
  // Helpers
  // ============================================================================

  /**
   * Refresh user data from server
   */
  const refreshUserData = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired
          await logout()
          return
        }

        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as any

      if (data.success && data.user) {
        setState((prev) => ({
          ...prev,
          user: data.user,
          isAuthenticated: true,
          error: null,
        }))

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))

        // Fetch rate limit status
        const limitResponse = await fetch(`${API_BASE}/api/auth/rate-limit-status`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (limitResponse.ok) {
          const limitData = (await limitResponse.json()) as any

          if (limitData.success) {
            setState((prev) => ({
              ...prev,
              rateLimitStatus: limitData.status,
            }))
          }
        }
      }
    } catch (err) {
      console.error('[useAuth] Refresh error:', err)
    }
  }, [])

  // ============================================================================
  // Public Methods
  // ============================================================================

  /**
   * Initiate login
   */
  const login = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = (await response.json()) as any

      if (!data.success) {
        throw new Error(data.error || 'Login initiation failed')
      }

      // Redirect to Google OAuth
      window.location.href = data.authUrl
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }))

      throw err
    }
  }, [])

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      const token = state.token

      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (err) {
      console.error('[useAuth] Logout error:', err)
    } finally {
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
        isAuthenticated: false,
        rateLimitStatus: null,
        error: null,
      }))

      localStorage.removeItem(STORAGE_KEY_TOKEN)
      localStorage.removeItem(STORAGE_KEY_USER)
    }
  }, [state.token])

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (!state.token) {
      throw new Error('Not authenticated')
    }

    await refreshUserData(state.token)
  }, [state.token, refreshUserData])

  /**
   * Verify email
   */
  const verifyEmail = useCallback(
    async (code: string) => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verificationToken: code }),
        })

        const data = (await response.json()) as any

        if (!data.success) {
          throw new Error(data.error || 'Verification failed')
        }

        // Refresh user data
        await refreshUser()
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Verification failed'

        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }))

        throw err
      }
    },
    [refreshUser]
  )

  /**
   * Get Authorization header
   */
  const getAuthHeader = useCallback(() => {
    if (!state.token) {
      return null
    }

    return {
      Authorization: `Bearer ${state.token}`,
    }
  }, [state.token])

  // ============================================================================
  // Return
  // ============================================================================

  return {
    ...state,
    login,
    logout,
    refreshUser,
    verifyEmail,
    getAuthHeader,
  }
}

// ============================================================================
// Context (Optional)
// ============================================================================

import React, { createContext, useContext } from 'react'

const AuthContext = createContext<UseAuthReturn | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
