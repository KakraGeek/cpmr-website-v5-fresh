import type { CollectionEntry } from 'astro:content';
import { isPublicDepartment } from '../departments/department-home-helpers';
import { staffProfilePath } from './staff-directory-helpers';

function projectDetailPath(projectId: string): string {
	return `/research/projects/${projectId}/`;
}

export type PublicPublicationEntry = CollectionEntry<'publications'> & {
	data: { entry_type: 'publication' };
};

export type PublicationsIndexShellEntry = CollectionEntry<'publications'> & {
	data: { entry_type: 'index_shell' };
};

export function isPublicPublication(
	entry: CollectionEntry<'publications'>,
): entry is PublicPublicationEntry {
	if (entry.data.entry_type !== 'publication') return false;
	if (entry.data.editorial_status !== 'approved') return false;
	if (entry.data.archived) return false;
	return true;
}

export function publicationDetailPath(publicationId: string): string {
	return `/research/publications/${publicationId}/`;
}

export type DepartmentLink = {
	id: string;
	name: string;
	href: string;
};

export function resolveDepartmentLinks(
	departmentIds: readonly string[],
	departments: CollectionEntry<'departments'>[],
): DepartmentLink[] {
	const publicById = new Map(
		departments.filter(isPublicDepartment).map((entry) => [entry.data.id, entry]),
	);

	return departmentIds.flatMap((id) => {
		const dept = publicById.get(id);
		if (!dept) return [];
		return [
			{
				id: dept.data.id,
				name: dept.data.name,
				href: `/departments/${dept.data.id}/`,
			},
		];
	});
}

export type ProjectLink = {
	id: string;
	title: string;
	href: string;
};

export function resolveProjectLinks(
	projectIds: readonly string[],
	projects: CollectionEntry<'projects'>[],
): ProjectLink[] {
	const publicById = new Map(
		projects
			.filter((e) => e.data.entry_type === 'project' && e.data.editorial_status === 'approved')
			.map((entry) => [entry.data.id, entry]),
	);

	return projectIds.flatMap((id) => {
		const project = publicById.get(id);
		if (!project || project.data.entry_type !== 'project') return [];
		return [
			{
				id: project.data.id,
				title: project.data.title,
				href: projectDetailPath(project.data.id),
			},
		];
	});
}

export type ResolvedAuthor = {
	label: string;
	href?: string;
};

export function resolvePublicationAuthors(
	entry: PublicPublicationEntry,
	staff: CollectionEntry<'staff'>[],
): ResolvedAuthor[] {
	const staffById = new Map(
		staff
			.filter((e) => e.data.entry_type === 'staff' && e.data.editorial_status === 'approved')
			.map((s) => [s.data.id, s]),
	);

	if (entry.data.author_display_mode === 'staff_ids') {
		return entry.data.authors.flatMap((staffId) => {
			const member = staffById.get(staffId);
			if (!member || member.data.entry_type !== 'staff') {
				return [{ label: staffId }];
			}
			return [
				{
					label: member.data.full_name,
					href: staffProfilePath(member.data.id),
				},
			];
		});
	}

	return entry.data.authors.map((name) => ({ label: name }));
}

export function formatAuthorList(authors: ResolvedAuthor[]): string {
	return authors.map((a) => a.label).join(', ');
}

export function sortPublicPublications(
	entries: PublicPublicationEntry[],
): PublicPublicationEntry[] {
	return [...entries].sort((a, b) => {
		if (b.data.year !== a.data.year) return b.data.year - a.data.year;
		return a.data.title.localeCompare(b.data.title, 'en');
	});
}

export function distinctResearchAreas(entries: PublicPublicationEntry[]): string[] {
	const areas = new Set<string>();
	for (const entry of entries) {
		const area = entry.data.research_area?.trim();
		if (area) areas.add(area);
	}
	return [...areas].sort((a, b) => a.localeCompare(b, 'en'));
}

export function distinctYears(entries: PublicPublicationEntry[]): number[] {
	const years = new Set(entries.map((e) => e.data.year));
	return [...years].sort((a, b) => b - a);
}

/** PRD P4 — PDF surfaces only when a governed download id is set (rights checked when downloads collection ships). */
export function publicationPdfHref(entry: PublicPublicationEntry): string | undefined {
	if (!entry.data.pdf_download_id) return undefined;
	return undefined;
}

export function publicationDoiHref(doiUrl: string | undefined): string | undefined {
	const raw = doiUrl?.trim();
	if (!raw) return undefined;
	if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
	return `https://doi.org/${raw.replace(/^doi:\s*/i, '')}`;
}
