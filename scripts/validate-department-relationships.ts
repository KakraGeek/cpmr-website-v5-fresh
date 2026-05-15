/**
 * E5-S09 — Department cross-collection relationship integrity (build-time).
 *
 * Invoked from `src/content.config.ts` on every `npm run build` / `npm run validate`.
 * Policy: `docs/03_architecture/04_architecture.md` §5.4 (fail / warn matrix).
 * Utilities: `src/lib/content/refs.ts` (REM-CARCH-006).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import {
	applyRefIntegrityResult,
	indexCollectionIds,
	validatePlainIdsExist,
	type RefIntegrityResult,
} from '../src/lib/content/refs';

function mergeRefIntegrityResults(results: readonly RefIntegrityResult[]): RefIntegrityResult {
	const issues = results.flatMap((r) => r.issues);
	const shouldFailBuild = results.some((r) => r.shouldFailBuild);
	return { issues, shouldFailBuild };
}

const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface DepartmentRelationshipEntry {
	/** Relative path under `src/content/departments/` for error messages. */
	sourceFile: string;
	departmentId: string;
	headOfDepartmentStaffId?: string;
	relatedServiceIds: readonly string[];
}

function readFrontmatterBlock(filePath: string): string {
	const raw = readFileSync(filePath, 'utf8');
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) {
		throw new Error(`[cpmr-department-integrity] Missing frontmatter in ${filePath}`);
	}
	return match[1];
}

function readScalarField(frontmatter: string, key: string): string | undefined {
	const re = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm');
	const m = frontmatter.match(re);
	if (!m) return undefined;
	const value = m[1].trim();
	if (value === '' || value === '~' || value === 'null') return undefined;
	return value.replace(/^['"]|['"]$/g, '');
}

function readEntryType(frontmatter: string): string | undefined {
	return readScalarField(frontmatter, 'entry_type');
}

function readInlineStringArray(frontmatter: string, key: string): string[] {
	const re = new RegExp(`^${key}:\\s*(\\[[^\\]]*\\])\\s*$`, 'm');
	const m = frontmatter.match(re);
	if (!m) return [];
	const inner = m[1].slice(1, -1).trim();
	if (inner === '') return [];
	return inner
		.split(',')
		.map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
		.filter((s) => s.length > 0);
}

/** Index `id` fields from governed content folders when present (pre-collection-bootstrap). */
function indexIdsFromContentDir(
	dirRelativeToSrc: string,
	options: { idField?: string } = {},
): ReadonlySet<string> {
	const idField = options.idField ?? 'id';
	const dir = join(process.cwd(), 'src/content', dirRelativeToSrc);
	if (!existsSync(dir)) return new Set();

	const ids: string[] = [];
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		if (!name.isFile()) continue;
		const ext = extname(name.name);
		if (ext !== '.md' && ext !== '.mdx') continue;
		const fm = readFrontmatterBlock(join(dir, name.name));
		const id = readScalarField(fm, idField);
		if (id && KEBAB_ID.test(id)) ids.push(id);
	}
	return indexCollectionIds(ids.map((id) => ({ id })));
}

function loadDepartmentEntries(): DepartmentRelationshipEntry[] {
	const deptDir = join(process.cwd(), 'src/content/departments');
	if (!existsSync(deptDir)) return [];

	const entries: DepartmentRelationshipEntry[] = [];
	for (const name of readdirSync(deptDir, { withFileTypes: true })) {
		if (!name.isFile()) continue;
		const ext = extname(name.name);
		if (ext !== '.md' && ext !== '.mdx') continue;

		const filePath = join(deptDir, name.name);
		const fm = readFrontmatterBlock(filePath);
		if (readEntryType(fm) !== 'department') continue;

		const departmentId = readScalarField(fm, 'id');
		if (!departmentId) {
			throw new Error(
				`[cpmr-department-integrity] Department entry missing id in ${name.name}`,
			);
		}

		const stem = basename(name.name, ext);
		if (stem !== departmentId) {
			throw new Error(
				`[cpmr-department-integrity] Department id "${departmentId}" must match file stem "${stem}" (${name.name})`,
			);
		}

		entries.push({
			sourceFile: join('src/content/departments', name.name),
			departmentId,
			headOfDepartmentStaffId: readScalarField(fm, 'head_of_department_staff_id'),
			relatedServiceIds: readInlineStringArray(fm, 'related_service_ids'),
		});
	}
	return entries;
}

function validateDepartmentEntry(
	entry: DepartmentRelationshipEntry,
	staffIndex: ReadonlySet<string>,
	servicesIndex: ReadonlySet<string>,
): RefIntegrityResult {
	const parts: RefIntegrityResult[] = [];

	if (entry.headOfDepartmentStaffId) {
		parts.push(
			validatePlainIdsExist({
				ids: [entry.headOfDepartmentStaffId],
				index: staffIndex,
				relationship: `${entry.sourceFile} head_of_department_staff_id → staff.id`,
				surface: 'scholarly_general',
			}),
		);
	}

	if (entry.relatedServiceIds.length > 0) {
		parts.push(
			validatePlainIdsExist({
				ids: entry.relatedServiceIds,
				index: servicesIndex,
				relationship: `${entry.sourceFile} related_service_ids → services.id`,
				surface: 'scholarly_general',
			}),
		);
	}

	return mergeRefIntegrityResults(parts);
}

/** Synthetic case — proves scholarly warn path without mutating governed content. */
function assertDepartmentRelationshipIntegritySmokeTest(): void {
	const bad = validateDepartmentEntry(
		{
			sourceFile: 'E5-S09/smoke',
			departmentId: 'smoke-dept',
			headOfDepartmentStaffId: 'missing-staff-smoke-e5-s09',
			relatedServiceIds: [],
		},
		new Set(),
		new Set(),
	);
	if (bad.issues.length === 0) {
		throw new Error('E5-S09 smoke: expected scholarly issue for missing staff id');
	}
	if (bad.shouldFailBuild) {
		throw new Error('E5-S09 smoke: department staff FK must not fail build (scholarly)');
	}
	let threw = false;
	try {
		applyRefIntegrityResult(bad, { warn: () => {}, error: () => {} });
	} catch {
		threw = true;
	}
	if (threw) {
		throw new Error('E5-S09 smoke: applyRefIntegrityResult must not throw for scholarly surface');
	}
}

/**
 * Walk `departments` entries and assert cross-collection foreign keys per §5.4.
 * Throws only when a **regulated** surface breaks (none on department fields today).
 */
export function assertDepartmentRelationshipIntegrity(): void {
	assertDepartmentRelationshipIntegritySmokeTest();

	const departments = loadDepartmentEntries();
	const staffIndex = indexIdsFromContentDir('staff');
	const servicesIndex = indexIdsFromContentDir('services');

	const combined = mergeRefIntegrityResults(
		departments.map((entry) => validateDepartmentEntry(entry, staffIndex, servicesIndex)),
	);

	applyRefIntegrityResult(combined);
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
	assertDepartmentRelationshipIntegrity();
}
