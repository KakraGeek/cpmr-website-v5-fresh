import type { CollectionEntry } from 'astro:content';
import {
	isPublicPublication,
	sortPublicPublications,
	type PublicPublicationEntry,
} from '../content/publication-library-helpers';

export function departmentPublicationsPath(departmentId: string): string {
	return `/departments/${departmentId}/publications/`;
}

export function publicationBelongsToDepartment(
	entry: PublicPublicationEntry,
	departmentId: string,
): boolean {
	return entry.data.department_ids.includes(departmentId);
}

export function filterDepartmentPublications(
	entries: CollectionEntry<'publications'>[],
	departmentId: string,
): PublicPublicationEntry[] {
	const publicForDept = entries.filter(
		(entry): entry is PublicPublicationEntry =>
			isPublicPublication(entry) && publicationBelongsToDepartment(entry, departmentId),
	);
	return sortPublicPublications(publicForDept);
}

export const departmentPublicationsPageCopy = {
	sectionTitle: 'Department publications',
	lede: 'Research publications linked to this department at build time via stable department identifiers. Full records live in the institutional publications repository.',
	emptyTitle: 'No publications for this department yet',
	emptyBody:
		'When approved publication records include this department in their metadata, they will appear here with links to full publication profiles on the research site.',
	filterYearLabel: 'Publication year',
	filterYearAll: 'All years',
	repositoryLinkLabel: 'Browse all CPMR publications',
} as const;
