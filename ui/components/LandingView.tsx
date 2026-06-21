/**
 * Landing Page Component
 * Hero, positioning, and trust signals for Ruby
 */

import React, { useState } from 'react'
import { LoginView } from './LoginView'

interface LandingViewProps {
  onLoginSuccess: (user: any, token: string) => void
  onError?: (error: string) => void
}

export const LandingView: React.FC<LandingViewProps> = ({ onLoginSuccess, onError }) => {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginView onLoginSuccess={onLoginSuccess} onError={onError} />
  }

  return (
    <div style={styles.page}>
      {/* Navigation Header */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <span style={styles.logoText}>🔴 Ruby</span>
            <span style={styles.eyebrow}>Local proxy · Cross-model context layer</span>
          </div>
          <div style={styles.navRight}>
            <a
              href="https://github.com/ProfessionalQwerty/ProjectRuby"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.githubLink}
            >
              GitHub
            </a>
            <button onClick={() => setShowLogin(true)} style={styles.loginLink}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.headline}>Your codebase doesn't reset when your model does.</h1>

          <p style={styles.subheadline}>
            Ruby builds a persistent, continuously updated map of your repository and serves it to any coding
            agent — Claude Code, Cursor, Codex, or whatever you're running next year. No re-reading files. No
            rediscovering the same dependencies every session. Just the context that matters, every time.
          </p>

          <p style={styles.benefit}>
            <strong>30–50% fewer tokens per request.</strong> Same understanding, whichever model you're talking to.
          </p>

          <div style={styles.ctaContainer}>
            <button style={styles.ctaPrimary} onClick={() => setShowLogin(true)}>
              Install Ruby
            </button>
            <a href="#how-it-works" style={styles.ctaSecondary}>
              See how it works →
            </a>
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section id="how-it-works" style={styles.differentiation}>
        <div style={styles.differentiationContent}>
          <h2 style={styles.differentiationTitle}>This isn't just a smaller context window.</h2>

          <p style={styles.differentiationBody}>
            A handful of tools now index your repo into a graph to cut tokens on a single session. That helps — until
            you switch models, open a new branch, or come back next week, and the agent starts from zero again. The
            graph gets thrown away with the session that built it.
          </p>

          <p style={styles.differentiationBody}>
            Ruby treats that graph as the asset, not a byproduct. It's built once, updated incrementally as your code
            changes, and kept independent of any single model. Switch from Claude to GPT to a local model mid-project
            and Ruby's understanding of your codebase comes with you — it isn't tied to whoever you were talking to
            last.
          </p>

          {/* Three Value Props */}
          <div style={styles.valuePropsGrid}>
            <div style={styles.valueProp}>
              <div style={styles.valueIcon}>📊</div>
              <h3 style={styles.valueTitle}>Persistent, not per-session.</h3>
              <p style={styles.valueText}>
                The graph is built and refreshed continuously in the background, so the expensive analysis happens
                before you prompt — not during, and not from scratch every time.
              </p>
            </div>

            <div style={styles.valueProp}>
              <div style={styles.valueIcon}>🔄</div>
              <h3 style={styles.valueTitle}>Model-agnostic by design.</h3>
              <p style={styles.valueText}>
                Ruby sits between your agent and the model as a local proxy. It works the same way whether the request
                is headed to Claude, GPT, or a model that doesn't exist yet.
              </p>
            </div>

            <div style={styles.valueProp}>
              <div style={styles.valueIcon}>📈</div>
              <h3 style={styles.valueTitle}>The graph compounds.</h3>
              <p style={styles.valueText}>
                The longer Ruby runs against a codebase, the more precise its understanding gets. Token savings are the
                thing you notice on day one. The persistent map is the thing that's still valuable a year in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Diagram */}
      <section style={styles.architecture}>
        <div style={styles.architectureContent}>
          <h2 style={styles.architectureTitle}>Architecture</h2>

          <div style={styles.diagramContainer}>
            <div style={styles.diagramBox}>
              <div style={styles.diagramLabel}>Your Agent</div>
              <div style={styles.diagramSmallText}>Claude Code, Cursor, etc</div>
            </div>

            <div style={styles.diagramArrow}>↓</div>

            <div style={styles.diagramBox}>
              <div style={styles.diagramLabel}>Local Proxy</div>
              <div style={styles.diagramSmallText}>Intercept • Compile • Forward</div>
            </div>

            <div style={styles.diagramArrow}>↓</div>

            <div style={styles.diagramBox}>
              <div style={styles.diagramLabel}>Repository Intelligence</div>
              <div style={styles.diagramSmallText}>Persistent memory • On your machine</div>
            </div>

            <div style={styles.diagramArrow}>↓</div>

            <div style={styles.diagramBox}>
              <div style={styles.diagramLabel}>LLM Provider</div>
              <div style={styles.diagramSmallText}>Claude, GPT-4, Local models</div>
            </div>
          </div>

          <p style={styles.architectureCaption}>
            Ruby works as a transparent proxy. It sits between your coding agent and any LLM provider, injecting
            repository context before forwarding and recording outcomes for persistent memory.
          </p>
        </div>
      </section>

      {/* Trust Signals */}
      <section style={styles.trust}>
        <div style={styles.trustContent}>
          <h2 style={styles.trustTitle}>Built for trust and transparency</h2>

          <div style={styles.trustGrid}>
            <div style={styles.trustCard}>
              <div style={styles.trustIcon}>🔐</div>
              <h3 style={styles.trustCardTitle}>Privacy by Default</h3>
              <p style={styles.trustCardText}>All repository learning happens on your machine. Code never leaves your computer unless you explicitly opt in to cloud sync.</p>
              <a href="#privacy" style={styles.trustLink}>
                Read privacy details →
              </a>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustIcon}>📂</div>
              <h3 style={styles.trustCardTitle}>Open Source</h3>
              <p style={styles.trustCardText}>View the source code, fork, contribute, or self-host. No proprietary dependencies or vendor lock-in.</p>
              <a
                href="https://github.com/ProfessionalQwerty/ProjectRuby"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.trustLink}
              >
                View on GitHub →
              </a>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustIcon}>⚡</div>
              <h3 style={styles.trustCardTitle}>Local First</h3>
              <p style={styles.trustCardText}>Ruby runs as a local daemon on your machine. All computation and storage happen locally by default.</p>
              <a href="/docs/local-deployment" style={styles.trustLink}>
                Self-hosting guide →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Notice */}
      <section id="privacy" style={styles.privacy}>
        <div style={styles.privacyContent}>
          <h2 style={styles.privacyTitle}>Privacy & Data Handling</h2>

          <div style={styles.privacyGrid}>
            <div style={styles.privacyColumn}>
              <h3 style={styles.privacySubtitle}>✅ What stays on your machine:</h3>
              <ul style={styles.privacyList}>
                <li>Repository structure and dependencies</li>
                <li>File relationships and patterns</li>
                <li>Interaction history</li>
                <li>Architecture facts and insights</li>
              </ul>
            </div>

            <div style={styles.privacyColumn}>
              <h3 style={styles.privacySubtitle}>❌ What we never store:</h3>
              <ul style={styles.privacyList}>
                <li>Raw source code</li>
                <li>File contents or paths</li>
                <li>API keys or credentials</li>
                <li>Personal or sensitive data</li>
              </ul>
            </div>
          </div>

          <p style={styles.privacyNote}>
            Optional cloud sync only sends anonymized metrics and never includes raw code, file paths, or secrets. You
            control what leaves your machine.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContent}>
          <h2 style={styles.featuresTitle}>Built for developers</h2>

          <div style={styles.featuresList}>
            <div style={styles.featureItem}>
              <span style={styles.featureBullet}>✨</span>
              <div>
                <h3 style={styles.featureName}>Cross-Model Memory</h3>
                <p style={styles.featureDescription}>Switch from Claude to GPT mid-project. Ruby's understanding of your codebase comes with you.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <span style={styles.featureBullet}>🔄</span>
              <div>
                <h3 style={styles.featureName}>IDE Independent</h3>
                <p style={styles.featureDescription}>Use Ruby from VS Code, Cursor, Neovim, or CLI. Same repository intelligence everywhere.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <span style={styles.featureBullet}>📊</span>
              <div>
                <h3 style={styles.featureName}>Persistent API</h3>
                <p style={styles.featureDescription}>REST API for querying repository intelligence, exporting snapshots, and managing context.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <span style={styles.featureBullet}>⚙️</span>
              <div>
                <h3 style={styles.featureName}>Developer Friendly</h3>
                <p style={styles.featureDescription}>Simple configuration. Works with any LLM provider. No re-architecture needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <div style={styles.finalCtaContent}>
          <h2 style={styles.finalCtaTitle}>Ready to try Ruby?</h2>
          <p style={styles.finalCtaSubtitle}>Install free today. No credit card required.</p>

          <div style={styles.finalCtaButtons}>
            <button style={styles.ctaPrimary} onClick={() => setShowLogin(true)}>
              Install Ruby
            </button>
            <a href="https://github.com/ProfessionalQwerty/ProjectRuby" target="_blank" rel="noopener noreferrer" style={styles.ctaSecondary}>
              View on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerColumn}>
            <div style={styles.footerLogo}>🔴 Ruby</div>
            <p style={styles.footerDescription}>Persistent repository intelligence for any coding model.</p>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>Product</h4>
            <ul style={styles.footerLinks}>
              <li>
                <a href="#" style={styles.footerLink}>
                  Install
                </a>
              </li>
              <li>
                <a href="#" style={styles.footerLink}>
                  Docs
                </a>
              </li>
              <li>
                <a href="/pricing" style={styles.footerLink}>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>Community</h4>
            <ul style={styles.footerLinks}>
              <li>
                <a href="https://github.com/ProfessionalQwerty/ProjectRuby" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" style={styles.footerLink}>
                  Discussions
                </a>
              </li>
              <li>
                <a href="#" style={styles.footerLink}>
                  Issues
                </a>
              </li>
            </ul>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>Legal</h4>
            <ul style={styles.footerLinks}>
              <li>
                <a href="#privacy" style={styles.footerLink}>
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" style={styles.footerLink}>
                  Terms
                </a>
              </li>
              <li>
                <a href="#" style={styles.footerLink}>
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>© 2026 Ruby. Built with care.</p>
        </div>
      </footer>
    </div>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: '#0f0f0f',
    color: '#f8f8f8',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: '1.6',
  },

  nav: {
    background: '#1a1a1a',
    borderBottom: '1px solid #2b2b2b',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },

  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  logoText: {
    fontSize: '20px',
    fontWeight: 700,
  },

  eyebrow: {
    fontSize: '11px',
    color: '#9f9f9f',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  navRight: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },

  githubLink: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'color 0.2s',
  },

  loginLink: {
    background: 'transparent',
    border: '1px solid #4b5563',
    color: '#f8f8f8',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
  },

  hero: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)',
    padding: '80px 32px',
    textAlign: 'center',
  },

  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },

  headline: {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '24px',
    lineHeight: '1.2',
  },

  subheadline: {
    fontSize: '18px',
    color: '#c0c0c0',
    marginBottom: '24px',
    lineHeight: '1.6',
  },

  benefit: {
    fontSize: '16px',
    color: '#0ea5e9',
    marginBottom: '40px',
  },

  ctaContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  ctaPrimary: {
    background: '#0ea5e9',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  ctaSecondary: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 32px',
    border: '1px solid #0ea5e9',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },

  differentiation: {
    padding: '80px 32px',
    background: '#0f0f0f',
  },

  differentiationContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },

  differentiationTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '32px',
    textAlign: 'center',
  },

  differentiationBody: {
    fontSize: '16px',
    color: '#c0c0c0',
    marginBottom: '32px',
    lineHeight: '1.8',
  },

  valuePropsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    marginTop: '48px',
  },

  valueProp: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #2b2b2b',
  },

  valueIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },

  valueTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '12px',
  },

  valueText: {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.6',
  },

  architecture: {
    padding: '80px 32px',
    background: '#1a1a1a',
  },

  architectureContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },

  architectureTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '48px',
    textAlign: 'center',
  },

  diagramContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
  },

  diagramBox: {
    background: '#0f0f0f',
    border: '1px solid #2b2b2b',
    borderRadius: '8px',
    padding: '20px 32px',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
  },

  diagramLabel: {
    fontSize: '16px',
    fontWeight: 700,
  },

  diagramSmallText: {
    fontSize: '12px',
    color: '#9f9f9f',
    marginTop: '6px',
  },

  diagramArrow: {
    fontSize: '24px',
    color: '#0ea5e9',
  },

  architectureCaption: {
    fontSize: '14px',
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: '1.6',
  },

  trust: {
    padding: '80px 32px',
    background: '#0f0f0f',
  },

  trustContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },

  trustTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '48px',
    textAlign: 'center',
  },

  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },

  trustCard: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #2b2b2b',
  },

  trustIcon: {
    fontSize: '36px',
    marginBottom: '16px',
  },

  trustCardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '12px',
  },

  trustCardText: {
    fontSize: '14px',
    color: '#a0a0a0',
    marginBottom: '16px',
    lineHeight: '1.6',
  },

  trustLink: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },

  privacy: {
    padding: '80px 32px',
    background: '#1a1a1a',
  },

  privacyContent: {
    maxWidth: '1000px',
    margin: '0 auto',
  },

  privacyTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '48px',
    textAlign: 'center',
  },

  privacyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '48px',
    marginBottom: '48px',
  },

  privacyColumn: {
    background: '#0f0f0f',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #2b2b2b',
  },

  privacySubtitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '16px',
  },

  privacyList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },

  privacyNote: {
    fontSize: '14px',
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: '1.6',
  },

  features: {
    padding: '80px 32px',
    background: '#0f0f0f',
  },

  featuresContent: {
    maxWidth: '1000px',
    margin: '0 auto',
  },

  featuresTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '48px',
    textAlign: 'center',
  },

  featuresList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },

  featureItem: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid #2b2b2b',
  },

  featureBullet: {
    fontSize: '24px',
    minWidth: '40px',
    textAlign: 'center',
  },

  featureName: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '8px',
  },

  featureDescription: {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.6',
  },

  finalCta: {
    padding: '80px 32px',
    background: '#1a1a1a',
    borderTop: '1px solid #2b2b2b',
    borderBottom: '1px solid #2b2b2b',
  },

  finalCtaContent: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },

  finalCtaTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '12px',
  },

  finalCtaSubtitle: {
    fontSize: '18px',
    color: '#c0c0c0',
    marginBottom: '32px',
  },

  finalCtaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  footer: {
    background: '#0f0f0f',
    borderTop: '1px solid #2b2b2b',
    padding: '60px 32px 20px',
  },

  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
    paddingBottom: '40px',
    borderBottom: '1px solid #2b2b2b',
  },

  footerLogo: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '8px',
  },

  footerDescription: {
    fontSize: '13px',
    color: '#a0a0a0',
    lineHeight: '1.6',
  },

  footerHeading: {
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '16px',
  },

  footerLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },

  footerLink: {
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '13px',
    display: 'block',
    marginBottom: '12px',
    transition: 'color 0.2s',
  },

  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: '20px',
  },

  footerCopyright: {
    fontSize: '12px',
    color: '#7a7a7a',
  },
}

export default LandingView
