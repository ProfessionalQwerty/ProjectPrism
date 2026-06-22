# Contributing to PRISM

Thanks for helping improve PRISM. This doc is for **maintainers and contributors** — end-user install instructions are in [README.md](README.md).

## Repo boundary

This repo (`ProjectPrism`) is the **open-source client** only. The intelligence engine is proprietary and deploys separately to a private Hugging Face Space.

Before pushing:

```powershell
npm run verify-boundary
```

## Local development

```bash
npm install
cp ui/.env.example ui/.env.local
npm run dev
```

### UI environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Cloud engine URL (Hugging Face Space) |
| `VITE_PRISM_CLIENT_KEY` | Must match `PRISM_CLIENT_API_KEY` on engine |
| `VITE_HF_ACCESS_TOKEN` | HF read token — required when engine Space is **private** |
| `VITE_DOWNLOAD_BASE_URL` | Base URL for installer downloads in production builds |

## Releasing

1. Bump changes on `main`
2. Tag and push:

```bash
git tag v0.1.13
git push origin v0.1.13
```

GitHub Actions (`.github/workflows/release.yml`) will:

- Sync `package.json` version from the tag
- Build Windows, macOS, and Linux installers
- Verify cloud credentials are embedded in the UI bundle
- Publish a GitHub Release

### Required GitHub Actions secrets

| Secret | Purpose |
|--------|---------|
| `VITE_HF_ACCESS_TOKEN` | HF read token for private Space |
| `VITE_PRISM_CLIENT_KEY` | Client key matching engine `PRISM_CLIENT_API_KEY` |
| `VITE_DOWNLOAD_BASE_URL` | e.g. `https://github.com/ProfessionalQwerty/ProjectPrism/releases/latest/download` |

Optional SignPath secrets for Windows code signing — see [docs/SIGNPATH.md](docs/SIGNPATH.md).

### Release workflow gotcha

CI runs `build:electron` (with secrets) then `dist:only` (packaging only). **Do not** call `npm run dist` in CI — it rebuilds the UI without secrets and strips cloud credentials from the installer.

## Deploy targets

| Target | Remote |
|--------|--------|
| Website | Vercel (repo root) |
| Open source | GitHub `ProfessionalQwerty/ProjectPrism` |
| Desktop installers | GitHub Releases (CI) |
| npm install | `npx github:ProfessionalQwerty/ProjectPrism` |
