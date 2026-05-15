import type { CollectionEntry } from 'astro:content';
import {
	isPublicStaff,
	sortPublicStaff,
	type PublicStaffEntry,
} from '../content/staff-directory-helpers';

export function departmentStaffPath(departmentId: string): string {
	return `/departments/${departmentId}/staff/`;
}

export function staffBelongsToDepartment(
	entry: PublicStaffEntry,
	departmentId: string,
): boolean {
	return entry.data.department_ids.includes(departmentId);
}

export function filterDepartmentStaff(
	entries: CollectionEntry<'staff'>[],
	departmentId: string,
): PublicStaffEntry[] {
	const publicForDept = entries.filter(
		(entry): entry is PublicStaffEntry =>
			isPublicStaff(entry) && staffBelongsToDepartment(entry, departmentId),
	);
	return sortPublicStaff(publicForDept);
}

export type ExpertiseFilterOption = { id: string; label: string };

/** Unique expertise tags across department staff — for client-side filter when content supports it. */
export function collectExpertiseFilterOptions(
	staff: readonly PublicStaffEntry[],
): ExpertiseFilterOption[] {
	const tags = new Set<string>();
	for (const entry of staff) {
		for (const tag of entry.data.expertise_tags) {
			tags.add(tag);
		}
	}
	return [...tags]
		.sort((a, b) => a.localeCompare(b, 'en'))
		.map((tag) => ({ id: tag, label: tag }));
}

export const departmentStaffPageCopy = {
	sectionTitle: 'Team members',
	lede: 'Researchers and staff linked to this department at build time via stable department identifiers. Profile links use the global researcher directory.',
	emptyTitle: 'No staff listed for this department yet',
	emptyBody:
		'When approved staff records include this department in their metadata, team members will appear here with links to their full profiles.',
	filterSearchLabel: 'Search by name or role',
	filterSearchPlaceholder: 'Type a name or role…',
	filterExpertiseLabel: 'Expertise area',
	filterExpertiseAll: 'All expertise areas',
} as const;
