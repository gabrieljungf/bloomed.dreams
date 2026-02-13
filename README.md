# Bloomed Dreams — Source Code Showcase

⚠️ PROPRIETARY SOFTWARE — FOR PORTFOLIO REVIEW ONLY

This repository is publicly available strictly for demonstrating architectural decisions, implementation quality, and AI system design capabilities.

All rights reserved. No permission is granted to use, copy, modify, distribute, sublicense, or commercialize this software.

---

## Overview

Bloomed Dreams is an AI-powered dream interpretation platform currently in live beta.

In its current version, the system:

- Interprets dreams using LLM-based analysis
- Persists entries in a structured Dream Journal
- Allows optional authentication (login not required for core usage)

The long-term product vision is to evolve Bloomed into a **stateful AI companion powered by retrieval-augmented generation (RAG)** — capable of progressively learning symbolic patterns across a user’s dream history.

This repository reflects both the current implementation and the architectural foundation designed to support that evolution.

Live application: https://get-bloomed.com

---

## Architectural Intent

The system is intentionally structured to support future transition into:

- Persistent memory layers
- Context-aware multi-session reasoning
- User-specific symbolic retrieval
- Stateful AI interaction patterns

While RAG is not yet implemented, the data layer, journaling structure, and service separation are designed to enable it without major refactoring.

---

## Current Architecture

Built with Next.js 14 (App Router) with a server-first mindset and selective client-side interactivity.

### Core Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion  
- **State Management:** Zustand (isolated UI + session state)  
- **Backend:** Supabase (Postgres + Auth), Next.js Server Actions  
- **AI Processing:** LLM-based interpretation via orchestrated workflows (n8n + OpenRouter)  
- **Infrastructure:** Vercel (Edge Functions), Upstash (Redis rate limiting)

---

## Technical Highlights

### AI Interpretation Pipeline

- Stateless LLM interpretation endpoint
- Clear separation between AI orchestration and UI rendering
- Rate-limited Edge API for abuse protection
- Structured dream persistence layer enabling future retrieval mechanisms

---

### Data & Service Layer Design

Located primarily in `lib/services`.

Applied principles:

- End-to-end TypeScript safety
- Explicit Data Access Layer (DAL)
- Business logic isolated from presentation
- Schema prepared for longitudinal user history

---

### Product Direction: Toward Stateful RAG

Planned evolution includes:

- Retrieval of prior dreams during interpretation
- Symbol frequency analysis
- Pattern extraction across sessions
- Personal symbolic memory graph
- Long-term contextual embedding storage

The current architecture anticipates these capabilities by maintaining structured dream storage and modular service boundaries.

---

## License

Copyright © 2025 Gabriel Jung.

This repository is provided strictly for technical review and evaluation purposes.  
No usage rights are granted beyond viewing.
