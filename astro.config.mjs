import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// MVP delivery: static HTML to dist/ only — keep `output: 'static'`; do not add Astro server adapters.
// Ground rules: docs/03_architecture/06_project_context.md — Static output: docs/03_architecture/04_architecture.md §3

export default defineConfig({
  output: 'static',
  // 05 §12.2 / 06_project_context — trailing slash on; canonical in BaseLayout matches this policy.
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
