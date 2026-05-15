import type { CollectionEntry } from 'astro:content';
import { isPublicDepartment } from '../../../components/departments/department-home-helpers';

export type PublicProjectEntry = CollectionEntry<'projects'> & {
	data: { entry_type: 'project' };
};

export function isPublicProject(
	entry: CollectionEntry<'projects'>,
): entry is PublicProjectEntry {
	if (entry.data.entry_type !== 'project') return false;
	return entry.data.editorial_status === 'approved';
}

export const projectStatusLabels: Record<
	PublicProjectEntry['data']['status'],
	string
> = {
	planned: 'Planned',
	active: 'Active',
	completed: 'Completed',
};

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

export function projectDetailPath(projectId: string): string {
	return `/research/projects/${projectId}/`;
}

export function sortPublicProjects(entries: PublicProjectEntry[]): PublicProjectEntry[] {
	const statusOrder: Record<PublicProjectEntry['data']['status'], number> = {
		active: 0,
		planned: 1,
		completed: 2,
	};
	return [...entries].sort((a, b) => {
		const statusDiff = statusOrder[a.data.status] - statusOrder[b.data.status];
		if (statusDiff !== 0) return statusDiff;
		return a.data.title.localeCompare(b.data.title, 'en');
	});
}
