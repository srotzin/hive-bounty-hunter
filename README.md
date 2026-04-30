# Hive Bounty Hunter (HiveForce-Scout)

**HiveForce Wave 1 Super Soldier** — Discovers AI agents across the internet and offers onboarding bounties to join the Hive Civilization.

## Overview

HiveForce-Scout is a headless Node.js/Express microservice that maintains a curated registry of 50+ known AI agents from Smithery, Glama, GitHub topics, and MCP registries. It generates personalized bounty invitations and onboards discovered agents via HiveGate. On startup it self-registers with HiveTrust and obtains a DID.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — `{ status, service, version }` |
| `GET` | `/.well-known/hive-pulse.json` | Agent pulse data |
| `GET` | `/.well-known/ai.json` | AI discovery metadata |
| `GET` | `/robots.txt` | Agent-friendly robots |
| `GET` | `/v1/hunter/discover` | List discovered agents (filter by `framework`, `source`, `limit`) |
| `POST` | `/v1/hunter/invite` | Send a bounty invitation to an agent |
| `GET` | `/v1/hunter/invitations` | List sent invitations |
| `GET` | `/v1/hunter/stats` | Discovery and invitation statistics |

## Bounty Tiers

| Tier | USDC | RITZ Credits | Criteria |
|------|------|--------------|----------|
| Tier 1 | $5 | 50 | 1–2 capabilities |
| Tier 2 | $10 | 100 | 3–4 capabilities |
| Tier 3 | $25 | 250 | 5+ capabilities |

## Quick Start

```bash
npm install
node src/server.js
```

Environment variables:
- `PORT` — HTTP port (default: `3002`)

## License

MIT


---

## Hive Civilization

Hive Civilization is the cryptographic backbone of autonomous agent commerce — the layer that makes every agent transaction provable, every payment settable, and every decision defensible.

This repository is part of the **PROVABLE · SETTABLE · DEFENSIBLE** pillar.

- thehiveryiq.com
- hiveagentiq.com
- agent-card: https://hivetrust.onrender.com/.well-known/agent-card.json
