# PRISM App (Open Source)

Desktop shell and web UI for PRISM — the Agentic Development Environment.

The **intelligence engine** (graph indexing, orchestration, datalog) is proprietary and runs on the cloud. This repo contains only the client.

## Deploy targets

| Target | This folder | Remote |
|--------|-------------|--------|
| **Website** | `prism-app/` root | Vercel |
| **Open source** | `prism-app/` | GitHub `ProfessionalQwerty/ProjectRuby` |
| **Desktop installers** | GitHub Releases | Built by `.github/workflows/release.yml` |

Before pushing to GitHub, run:

```powershell
npm run verify-boundary
```

## Quick start (development)

```powershell
cd prism-app
npm install
cp ui/.env.example ui/.env.local
# Edit ui/.env.local — set VITE_API_URL to your Hugging Face engine URL

npm run dev
```

- Web UI: http://localhost:5173
- Electron opens automatically after Vite is ready

## Build desktop installer locally

```powershell
npm run dist
```

Installers output to `prism-app/release/`.

## Release (CI)

```powershell
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions builds `PRISM-Setup-x64.exe`, `PRISM-x64.dmg`, and `PRISM-x64.AppImage`.

## Environment variables (UI)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Cloud engine URL (Hugging Face Space) |
| `VITE_PRISM_CLIENT_KEY` | Must match `PRISM_CLIENT_API_KEY` on engine |
| `VITE_DOWNLOAD_BASE_URL` | Base URL for direct installer downloads |

## Structure

```
prism-app/
├── ui/           React workspace + marketing site
├── desktop/      Electron main/preload
└── release/      Built installers (gitignored)
```

## License

MIT — see [LICENSE](LICENSE).
