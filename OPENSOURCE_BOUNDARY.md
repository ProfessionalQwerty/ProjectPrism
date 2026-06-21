# Open Source Boundary (PRISM App)

## Public — `prism-app/` (MIT)

- `ui/` — React workspace, landing page, hooks, components
- `desktop/` — Electron shell (main, preload, folder upload)
- `public/ailogos/` — Model logos
- API client only (`ui/api-config.ts`) — calls cloud engine over HTTPS

## Private — `prism-engine/` (proprietary)

- `daemon/`, `adapters/`, `memory/`, `orchestration/`, `core/`, `proxy/`, `storage/`
- Graph indexer, context compilation, orchestration pipelines
- Dockerfile and Hugging Face deployment

## Client ↔ cloud

```
Desktop / Vercel UI  --HTTPS-->  HF Engine (/api/*)
                 X-PRISM-Client-Key header for agent routes
```

Desktop uploads local projects via `POST /api/projects/connect-upload`.

Run `npm run verify-boundary` in `prism-app/` before any GitHub push.
