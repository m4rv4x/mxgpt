# mxgpt

Self-hosted AI web chat for local or remote Ollama-style backends.

## Overview

`mxgpt` is a lightweight chat UI project built around a simple web frontend and a minimal runtime setup. The goal is straightforward: run a personal AI chat interface without depending on a hosted SaaS product.

## Highlights

- Self-hosted chat interface
- Ollama endpoint configurable through environment variables
- Docker and `docker compose` ready
- Fast local setup for experiments

## Quick start

### Docker

```bash
docker compose up --build -d
```

Default app URL:

```text
http://localhost:3000
```

### Local development

```bash
npm install
npm start
```

If you also use the local Node entrypoint in this project:

```bash
node index.js
```

## Configuration

Create a `.env` file from the example values below:

```env
OLLAMA_URL=http://localhost:11434
PORT=3000
```

With Docker, the compose file defaults to:

```env
OLLAMA_URL=http://host.docker.internal:11434
```

## Project status

This repository is an experimental self-hosted project. Expect iteration, cleanup, and documentation improvements over time.

## License

MIT
