# PRISM

**Build with AI. Keep your context. Ship without the terminal.**

PRISM is a desktop app that lets you work with Claude, GPT, Gemini, or local models in one workspace — with memory that survives every session and model switch. Connect a project, chat with agents, preview locally, and deploy to Vercel when you're ready.

> The heavy lifting (graph indexing, orchestration, datalog) runs on PRISM's cloud engine. This repo is the **open-source app** you install on your machine.

---

## Install (fastest way)

**Requires [Node.js](https://nodejs.org/) 18+**

```bash
npx --yes github:ProfessionalQwerty/ProjectPrism
```

This downloads the latest release for your OS and creates a desktop shortcut.

### Or download directly

Get installers from **[GitHub Releases](https://github.com/ProfessionalQwerty/ProjectPrism/releases/latest)**:

| Platform | File |
|----------|------|
| Windows | `PRISM-Setup-x64.exe` or `PRISM-Setup-x64.zip` |
| macOS | `PRISM-mac-x64.dmg` or `PRISM-mac-x64.zip` |
| Linux | `PRISM-linux-x64.tar.gz` or `PRISM-linux-x64.AppImage` |

After installing, launch **PRISM** from your desktop or Start menu.

---

## First 5 minutes

1. **Open PRISM** — the app connects to the hosted cloud engine automatically.
2. **Add a model** — click **+** in the top bar (OpenAI, Claude, Gemini, or local Ollama).
3. **Connect a project** — sidebar → connect a folder or upload files.
4. **Chat** — your repo context, vision doc, and session history stay loaded across tabs.
5. **Deploy (optional)** — open the **Connections** tab → link GitHub + Vercel → hit **Deploy**.

### Useful commands in chat

| Command | What it does |
|---------|----------------|
| `/catchup` | Sync the model with everything that changed since your last session |
| `/deploy` | Commit, push to GitHub, and deploy on Vercel |
| `/preview` | Start a local dev-server preview inside PRISM |

---

## Connections & deploy

PRISM is built for the moment after "it works locally" — when you need to put it on the internet without learning git or DevOps.

In the **Connections** panel (right sidebar):

- **GitHub** — one-time OAuth; PRISM handles commits and pushes for you
- **Vercel** — paste a token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Local preview** — runs `npm run dev` in the background and opens your browser
- **Deploy** — commit → push → Vercel build → live URL shown in the app

No terminal required unless something breaks — and your agents already have project context to help fix it.

---

## Troubleshooting

### "Cloud engine offline"

The app couldn't reach the PRISM cloud backend. Try:

1. Check your internet connection
2. Click **Retry** in the yellow banner
3. Install the **[latest release](https://github.com/ProfessionalQwerty/ProjectPrism/releases/latest)** — older builds may not match the current engine

### Update keeps offering the same version

Download the installer from **Releases** (not an old cached file). After v0.1.12, the in-app version number matches the release tag.

### Linux AppImage won't run

Some distros need FUSE for AppImages. Prefer the `.tar.gz` portable build, or install `libfuse2` on your system.

---

## For developers

Want to run from source or contribute?

```bash
git clone https://github.com/ProfessionalQwerty/ProjectPrism.git
cd ProjectPrism
npm install
cp ui/.env.example ui/.env.local   # optional: point at your own engine URL
npm run dev
```

- Web UI: http://localhost:5173  
- Electron opens automatically when Vite is ready

| Script | Purpose |
|--------|---------|
| `npm run dev` | UI + Electron dev mode |
| `npm run build` | Production UI + desktop shell |
| `npm run dist` | Build installers → `release/` |
| `npm run type-check` | TypeScript check |

Maintainer docs: [CONTRIBUTING.md](CONTRIBUTING.md) (releases, CI secrets, code signing).

---

## What this repo contains

```
ui/        React workspace + website
desktop/   Electron shell
scripts/   npx installer (install-prism.mjs)
build/     App icons
release/   Built installers (not in git)
```

---

## License

MIT — see [LICENSE](LICENSE).
