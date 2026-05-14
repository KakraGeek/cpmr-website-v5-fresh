/**
 * Cross-collection reference integrity utilities (build-time).
 *
 * Baseline: `docs/03_architecture/05_content_architecture_and_cms_strategy.md`
 * - §2.5 Relationship-driven publishing (directed edges; resolve at build)
 * - §4 Production build policy (relationship validation alongside Zod)
 * - §19 item 3 — resolver utilities asserting targets exist
 *
 * Fail / warn matrix (REM-CARCH-006 / CONTENT-ARCH-RETRO-008):
 * - `regulated_financial_legal` — fees, statutory, `legal_sensitive` services/downloads:
 *   **fail closed** (`shouldFailBuild` + `applyRefIntegrityResult` throws).
 * - `scholarly_general` — publications, news, staff cross-links, etc.:
 *   **warn** by default (`console.warn` via `applyRefIntegrityResult`; build continues)
 *   until programme tightens after bulk import (see remediation execution plan).
 */

export type RefIntegritySurface = 'regulated_financial_legal' | 'scholarly_general';

export interface RefIntegrityIssue {
  value: string;
  /** e.g. `publication.authors → staff.id` */
  relationship: string;
  message: string;
}

export interface RefIntegrityResult {
  issues: RefIntegrityIssue[];
  /** When true, `applyRefIntegrityResult` throws (regulated surfaces). */
  shouldFailBuild: boolean;
}

const STAFF_PREFIX = 'staff:';

export function refDispositionForSurface(surface: RefIntegritySurface): 'fail' | 'warn' {
  return surface === 'regulated_financial_legal' ? 'fail' : 'warn';
}

/** Build a `Set` of Astro collection entry ids for O(1) relationship checks. */
export function indexCollectionIds<T extends { id: string }>(entries: Iterable<T>): ReadonlySet<string> {
  return new Set(Array.from(entries, (e) => e.id));
}

/**
 * Validate plain kebab-case ids (e.g. `department_ids`, `related_service_ids`)
 * against a precomputed index.
 */
export function validatePlainIdsExist(options: {
  ids: readonly string[];
  index: ReadonlySet<string>;
  relationship: string;
  surface: RefIntegritySurface;
}): RefIntegrityResult {
  const issues: RefIntegrityIssue[] = [];
  for (const value of options.ids) {
    if (value.trim() === '') {
      issues.push({ value, relationship: options.relationship, message: 'empty id is invalid' });
      continue;
    }
    if (!options.index.has(value)) {
      issues.push({
        value,
        relationship: options.relationship,
        message: 'referenced id not found in target index',
      });
    }
  }
  const shouldFailBuild = issues.length > 0 && refDispositionForSurface(options.surface) === 'fail';
  return { issues, shouldFailBuild };
}

/**
 * Parse `publication.authors` tokens per **05 §6.1**:
 * internal refs use `staff:{staffId}`; any other string is external prose.
 */
export function parseStaffPrefixedRef(
  token: string,
): { kind: 'staff_ref'; id: string } | { kind: 'external'; literal: string } {
  const t = token.trim();
  if (t.startsWith(STAFF_PREFIX)) {
    return { kind: 'staff_ref', id: t.slice(STAFF_PREFIX.length).trim() };
  }
  return { kind: 'external', literal: t };
}

/** Validate only `staff:{id}` tokens against a `staff` collection id index. */
export function validatePublicationAuthorRefs(options: {
  tokens: readonly string[];
  staffIndex: ReadonlySet<string>;
  surface: RefIntegritySurface;
}): RefIntegrityResult {
  const issues: RefIntegrityIssue[] = [];
  for (const token of options.tokens) {
    const parsed = parseStaffPrefixedRef(token);
    if (parsed.kind !== 'staff_ref') continue;
    if (parsed.id.trim() === '') {
      issues.push({
        value: token,
        relationship: 'publication.authors (staff:)',
        message: 'empty id after staff: prefix',
      });
      continue;
    }
    if (!options.staffIndex.has(parsed.id)) {
      issues.push({
        value: token,
        relationship: 'publication.authors → staff.id',
        message: 'unknown staff id',
      });
    }
  }
  const shouldFailBuild = issues.length > 0 && refDispositionForSurface(options.surface) === 'fail';
  return { issues, shouldFailBuild };
}

export function formatRefIntegrityIssues(result: RefIntegrityResult): string {
  return result.issues.map((i) => `[${i.relationship}] "${i.value}": ${i.message}`).join('\n');
}

/**
 * Enforce policy: throws on regulated breakage; warns (no throw) on scholarly breakage.
 */
export function applyRefIntegrityResult(
  result: RefIntegrityResult,
  logger: Pick<typeof console, 'warn' | 'error'> = console,
): void {
  if (result.issues.length === 0) return;
  const text = formatRefIntegrityIssues(result);
  if (result.shouldFailBuild) {
    throw new Error(`[cpmr-content-refs] Build stopped: broken references on a regulated surface.\n${text}`);
  }
  logger.warn(`[cpmr-content-refs] Broken references (warn-only surface):\n${text}`);
}

/**
 * In-process smoke test for the fail/warn matrix. Invoked from `src/content.config.ts`
 * so `npm run build` / `npm run validate` exercises the utilities on every CI run.
 */
export function assertBuildTimeRefIntegritySmokeTest(): void {
  const index = new Set(['known-good']);

  const scholarlyBad = validatePlainIdsExist({
    ids: ['known-good', 'missing-id'],
    index,
    relationship: 'REM-CARCH-006 smoke / scholarly',
    surface: 'scholarly_general',
  });
  if (scholarlyBad.issues.length === 0) {
    throw new Error('REM-CARCH-006 smoke: expected at least one scholarly issue');
  }
  if (scholarlyBad.shouldFailBuild) {
    throw new Error('REM-CARCH-006 smoke: scholarly surface must not set shouldFailBuild');
  }

  const regulatedBad = validatePlainIdsExist({
    ids: ['missing-regulated'],
    index,
    relationship: 'REM-CARCH-006 smoke / regulated',
    surface: 'regulated_financial_legal',
  });
  if (regulatedBad.issues.length === 0) {
    throw new Error('REM-CARCH-006 smoke: expected regulated issues');
  }
  if (!regulatedBad.shouldFailBuild) {
    throw new Error('REM-CARCH-006 smoke: regulated surface must set shouldFailBuild');
  }

  let threw = false;
  try {
    applyRefIntegrityResult(regulatedBad, { warn: () => {}, error: () => {} });
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new Error('REM-CARCH-006 smoke: applyRefIntegrityResult must throw for regulated breakage');
  }

  const authorBad = validatePublicationAuthorRefs({
    tokens: ['staff:missing-staff', 'Plain Name'],
    staffIndex: index,
    surface: 'scholarly_general',
  });
  if (authorBad.issues.length === 0) {
    throw new Error('REM-CARCH-006 smoke: expected author token issue');
  }
}
