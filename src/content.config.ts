// Content collections entry point.
// Authoritative reference: docs/03_architecture/04_architecture.md §5 — schemas live here,
// relationships use stable string IDs resolved at build time, and forward-compat with a
// headless CMS / build-time ingestion is preserved by keeping the loader + Zod surface
// minimal until each real collection lands in its own story.
//
// Astro 6 convention: src/content.config.ts (top-level). Do not duplicate at src/content/config.ts.
// Constitution: docs/03_architecture/06_project_context.md — static output, no SSR.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// `_bootstrap` is an intentionally trivial collection that proves the content config
// pipeline compiles and that Zod validation runs at build time. It MUST be replaced or
// supplemented by real collections (departments, staff, projects, publications, services,
// products, news, events, announcements, downloads, pages, settings) in later E0/E1+
// stories — see architecture §5.1 for the recommended split.
const _bootstrap = defineCollection({
  loader: glob({ base: './src/content/_bootstrap', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  }),
});

/** E3-S01 — Homepage hero (DESIGN.md §13.7 `Hero`, §14.1 `home.hero`). */
const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: 'hero.md' }),
  schema: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    lede: z.string().optional(),
    /** At most one primary CTA (DESIGN.md §13.7, §14.1). */
    primary_action: z
      .object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
      .optional(),
    variant: z.enum(['centered', 'split']).default('centered'),
    surface: z.enum(['page', 'inverse']).default('page'),
    image: z
      .object({
        src: z.string().min(1),
        alt: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),
});

export const collections = {
  _bootstrap,
  home,
};
