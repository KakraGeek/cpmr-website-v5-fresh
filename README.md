# CPMR website (static rebuild)

Institutional site for the Centre for Plant Medicine Research (CPMR), built with [Astro](https://astro.build/) as a **static** site (`output: 'static'`). Governed copy and structured data live in the repo and are compiled at build time—see `docs/03_architecture/04_architecture.md` and `docs/03_architecture/06_project_context.md` for the full picture.

## Where content lives (for editors)

| Area | Purpose |
| --- | --- |
| **`src/content/`** | Editorial Markdown/MDX and frontmatter managed as Astro **content collections**—this is the primary home for durable institutional prose and collection entries. |
| **`src/data/`** | Structured aggregates (JSON/YAML/TS) such as navigation, footer links, and similar site-wide data consumed at build time. |
| **`src/components/`**, **`src/layouts/`**, **`src/pages/`** | Presentation: layout, UI behaviour, and route shells. They should not be the long-term sole home for “final” institutional truth strings; prefer `src/content/` or `src/data/` when adding new governed material. |

Ownership and workflow expectations align with **PRD §29** (`docs/01_planning/02_prd.md` — CMS / content editing requirements): MVP uses build-time ingestion, not a runtime CMS on the public host.

## Commands

From the repository root:

| Command | Use |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local development server (default `http://localhost:4321`) |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve the **built** `./dist/` output locally to review what deploys |
| `npm run validate` | Merge gate: runs `astro build` (see project constitution) |

**Editors:** use `npm run dev` while drafting; use `npm run preview` after `npm run build` to confirm the static output before release, per PRD §29 (local preview; no runtime preview server assumed on MVP hosting).

## Project layout (high level)

```text
/
├── docs/           Planning, design, architecture, stories
├── public/         Static assets served as-is
├── src/
│   ├── content/    Governed editorial collections
│   ├── data/       Governed structured data
│   ├── components/ UI and content-facing components
│   ├── layouts/    Page shells
│   ├── pages/      Routes
│   └── styles/     Global styles / theme entry
├── automation/     Sprint runner and local tooling (generated prompts may be gitignored)
└── package.json
```

## More documentation

- Story map and backlog: `docs/04_stories/05_story_map.md`
- PRD: `docs/01_planning/02_prd.md`
