import type { CollectionEntry } from 'astro:content';
import { isPublicDepartment } from '../departments/department-home-helpers';

export type PublicStaffEntry = CollectionEntry<'staff'> & {
	data: { entry_type: 'staff' };
};

export function isPublicStaff(entry: CollectionEntry<'staff'>): entry is PublicStaffEntry {
	if (entry.data.entry_type !== 'staff') return false;
	return entry.data.editorial_status === 'approved';
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

/** Global staff directory canonical path (E6-S03 — `/research/researchers/` per story AC). */
export function staffProfilePath(staffId: string): string {
	return `/research/researchers/${staffId}/`;
}

export function sortPublicStaff(entries: PublicStaffEntry[]): PublicStaffEntry[] {
	return [...entries].sort((a, b) => {
		const orderA = a.data.sort_order ?? Number.MAX_SAFE_INTEGER;
		const orderB = b.data.sort_order ?? Number.MAX_SAFE_INTEGER;
		if (orderA !== orderB) return orderA - orderB;
		return a.data.full_name.localeCompare(b.data.full_name, 'en');
	});
}

export function publicStaffEmail(entry: PublicStaffEntry): string | undefined {
	if (!entry.data.email_public || !entry.data.email) return undefined;
	return entry.data.email;
}
