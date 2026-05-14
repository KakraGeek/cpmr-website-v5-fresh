# Content architecture and CMS strategy

This document will capture how governed institutional content maps to Astro collections, build-time ingestion, and future headless CMS options. Until that narrative is expanded here, treat **`docs/03_architecture/04_architecture.md`** (especially §5 on collections and schemas) as the authoritative implementation contract.

**Homepage hero (E3-S01):** build-time hero copy and optional primary CTA live under `src/content/home/` (see `hero.md`) and are registered in `src/content.config.ts`, consistent with static output and CMS-forward markdown sources described in `06_project_context.md`.
