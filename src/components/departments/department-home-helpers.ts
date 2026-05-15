import type { CollectionEntry } from 'astro:content';

export type DepartmentNavItem = { label: string; href: string };

export type DepartmentPrimaryAction = { label: string; href: string };

const DEFAULT_NAV_SEGMENTS: { label: string; segment: string }[] = [
	{ label: 'Home', segment: '' },
	{ label: 'Staff', segment: 'staff' },
	{ label: 'Projects', segment: 'projects' },
	{ label: 'Publications', segment: 'publications' },
	{ label: 'Services', segment: 'services' },
	{ label: 'News', segment: 'news' },
	{ label: 'Downloads', segment: 'downloads' },
	{ label: 'Contact', segment: 'contact' },
];

export function isPublicDepartment(
	entry: CollectionEntry<'departments'>,
): entry is CollectionEntry<'departments'> & { data: { entry_type: 'department' } } {
	if (entry.data.entry_type !== 'department') return false;
	const { editorial_status, verified } = entry.data;
	return editorial_status === 'approved' && verified === true;
}

export function departmentBasePath(departmentId: string): string {
	return `/departments/${departmentId}/`;
}

export function resolveMiniSiteNav(
	departmentId: string,
	items: DepartmentNavItem[],
): DepartmentNavItem[] {
	if (items.length > 0) return items;
	const base = departmentBasePath(departmentId);
	return DEFAULT_NAV_SEGMENTS.map(({ label, segment }) => ({
		label,
		href: segment ? `${base}${segment}/` : base,
	}));
}

/** DESIGN.md §13.15 — 2–4 primary actions; routes align with 04_architecture.md §6.2. */
export function buildPrimaryActions(departmentId: string): DepartmentPrimaryAction[] {
	const base = departmentBasePath(departmentId);
	return [
		{ label: 'Contact', href: `${base}contact/` },
		{ label: 'Downloads', href: `${base}downloads/` },
		{ label: 'Our staff', href: `${base}staff/` },
		{ label: 'Our projects', href: `${base}projects/` },
	];
}

export function departmentInitials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
}

/** Strip leading markdown h1 so page keeps a single h1 in DepartmentHero (DESIGN.md §15). */
export function departmentBodyParagraphs(body: string): string[] {
	const withoutTitle = body.replace(/^#\s+.+\n+/, '').trim();
	if (!withoutTitle) return [];
	return withoutTitle
		.split(/\n\n+/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

export const departmentHomeEmptyStates = {
	projects: {
		title: 'No featured projects yet',
		body: 'Projects linked to this department will appear here once the research projects collection is published and curated for this unit.',
	},
	publications: {
		title: 'No recent publications yet',
		body: 'Department publications will be listed here when the publications collection is available and linked by department ID at build time.',
	},
	services: {
		title: 'No department services listed yet',
		body: 'Internal services offered by this department will appear here when service records are linked to this department.',
	},
	news: {
		title: 'No department news yet',
		body: 'News and updates scoped to this department will appear here when the news collection includes items for this unit.',
	},
} as const;
