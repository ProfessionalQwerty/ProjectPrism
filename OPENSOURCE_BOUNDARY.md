# Open Source Boundary (PRISM App)

## Public — `prism-app/` (MIT)

- `ui/` — React workspace, landing page, hooks, components
- `desktop/` — Electron shell (main, preload, folder upload, `node-pty` terminal)
- `public/ailogos/` — Model logos
- `LICENSE-THIRD-PARTY.md` — Attribution for Aider, LangChain, node-pty, RTK, Headroom, etc.
- API client only (`ui/api-config.ts`) — calls cloud engine over HTTPS

### What stays on the client

| Capability | Implementation |
|------------|----------------|
| UI & panels | `ui/components/prism/*` |
| Terminal | `desktop/src/pty-host.ts` + `node-pty` |
| File search | `ripgrep` binary / engine search routes |
| Local embeddings | `fastembed` + `lancedb` (where enabled) |
| Telemetry packeting | RTK scrub + compressed HTTPS payloads to engine |

## Private — `prism-engine/` (proprietary)

- `daemon/`, `adapters/`, `memory/`, `orchestration/`, `core/`, `proxy/`, `storage/`
- Graph indexer, context compilation, **staged orchestration** (think → plan → act)
- **Deploy auto-recovery** (GitHub/Vercel failure → agent fix → repush)
- Dockerfile and Hugging Face deployment

### What stays in the cloud

| Capability | Implementation |
|------------|----------------|
| Orchestrator brain | `orchestration/ruby-orchestrator.ts`, `staged-orchestrator.ts` |
| Trajectory ingestion | Ledger + Supabase sync pipelines |
| RL / training | Proprietary scripts & weights (not in this repo) |
| Model inference | `/api/orchestrator/*`, `/proxy/*` gateways |

## Client ↔ cloud

```
Desktop / Vercel UI  --HTTPS-->  HF Engine (/api/*)
                 X-PRISM-Client-Key header for agent routes
```

Desktop uploads local projects via `POST /api/projects/connect-upload`.

Run `npm run verify-boundary` in `prism-app/` before any GitHub push.
