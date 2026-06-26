# Third-Party Licenses & Attributions

PRISM combines an open client (`prism-app/`) with a proprietary cloud engine (`prism-engine/`).
This file lists third-party software used in the **open client** and acknowledges reference
implementations studied during development. See also `prism-app/OPENSOURCE_BOUNDARY.md`.

---

## Open Client Dependencies (`prism-app/`)

| Component | Role in PRISM | License |
|-----------|---------------|---------|
| [Electron](https://www.electronjs.org/) | Desktop shell, main/preload process | MIT |
| [node-pty](https://github.com/microsoft/node-pty) | Integrated terminal (PTY spawning) | MIT |
| [xterm.js](https://xtermjs.org/) | Terminal rendering in the workspace UI | MIT |
| [React](https://react.dev/) / [Vite](https://vitejs.dev/) | Web UI framework & build tooling | MIT |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling | MIT |
| [electron-updater](https://www.electron.build/auto-update) | Desktop auto-update channel | MIT |
| [Lucide](https://lucide.dev/) | Icon set | ISC |

Ripgrep is invoked as an external binary where bundled; see [ripgrep](https://github.com/BurntSushi/ripgrep) (MIT / Unlicense).

---

## Cloud Engine Dependencies (`prism-engine/` — proprietary, listed for transparency)

| Component | Role in PRISM | License |
|-----------|---------------|---------|
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Local execution ledger & project graph | MIT |
| [LangChain](https://github.com/langchain-ai/langchain) (patterns) | Trajectory / tool abstraction inspiration | MIT |
| [RTK](https://github.com/rtk-ai/rtk) (reference: `reference-repos/rtk-develop`) | Token scrubbing via `rtk log` / `rtk grep` | See upstream LICENSE |
| [Headroom](https://github.com/headroomai/headroom) (reference: `reference-repos/headroom-main`) | Optional desktop compression sidecar | See upstream LICENSE |
| [FastEmbed](https://github.com/qdrant/fastembed) / [LanceDB](https://lancedb.github.io/lancedb/) | Local embedding & vector storage (where enabled) | Apache-2.0 / Apache-2.0 |

The engine also integrates with hosted foundation models (OpenAI, Anthropic, Google, etc.) via user-supplied API keys.

---

## Reference Implementations (not shipped verbatim)

These repositories live under `reference-repos/` for study and attribution. PRISM reimplements
ideas in its own architecture; upstream code is **not** copied into production builds unless
noted as a direct dependency above.

| Project | Why we reference it | Upstream |
|---------|---------------------|----------|
| **Aider** | Pair-programming & diff-oriented agent flows | [Aider-AI/aider](https://github.com/Aider-AI/aider) |
| **LangChain** | Agent/tool chain patterns | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) |
| **node-pty** | Terminal integration | [microsoft/node-pty](https://github.com/microsoft/node-pty) |
| **ripgrep** | Fast workspace search | [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) |
| **RTK** | Context compression / scrubbing | `reference-repos/rtk-develop` |
| **Headroom** | Never-worse token compression sidecar | `reference-repos/headroom-main` |
| **Pi** | Agent UI patterns | `reference-repos/pi` |

---

## Boundary Summary

### Stays local (open client — `prism-app/`)

- UI & workspace layout (Electron / web shell)
- Terminal hooking (`node-pty`) & file search (`ripgrep`)
- Local parsing & vector management (`fastembed`, `lancedb` where enabled)
- Telemetry **packeting** scripts that compress prompts, diffs, and terminal logs before HTTPS upload

### Stays in the cloud (proprietary — `prism-engine/`)

- Orchestrator brain & staged think → plan → act pipelines
- Trajectory ingestion, cleaning, and training storage
- Reinforcement-learning / fine-tuning tooling and proprietary weights
- Model inference gateways and deploy auto-recovery orchestration

The client talks to the engine **only** over authenticated HTTPS (`/api/*`).

---

## Thank you

Thank you to the maintainers of Aider, LangChain, Microsoft node-pty, BurntSushi ripgrep, RTK,
Headroom, and the broader open-source agent ecosystem. PRISM is built on their shoulders.

For questions about licensing, contact the PRISM project owners.
