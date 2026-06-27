# mxgpt

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/m4rv4x/mxgpt?style=social)](https://github.com/m4rv4x/mxgpt)
[![Last Commit](https://img.shields.io/github/last-commit/m4rv4x/mxgpt)](https://github.com/m4rv4x/mxgpt)

Self-hosted AI web chat for local or remote Ollama-style backends.

## Overview

`mxgpt` is a lightweight chat UI project built around a simple web frontend and a minimal runtime setup. The goal is straightforward: run a personal AI chat interface without depending on a hosted SaaS product.

## Highlights

- **No external AI APIs required** — runs entirely against your own Ollama instance.
- **Docker-first** — single `docker-compose up` to get going.
- **Lightweight** — plain HTML/CSS/JS frontend, Express.js backend.
- **Self-hosted** — your data stays on your machine.

## Quick Start

```bash
git clone https://github.com/m4rv4x/mxgpt.git
cd mxgpt
docker-compose up -d
```

Then open `http://localhost:3000`.

## Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: Ollama API
- **Deployment**: Docker, Docker Compose

## License

MIT — see [LICENSE](LICENSE) for details.
