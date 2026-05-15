import type { CollectionEntry } from 'astro:content';
import {
	isPublicProject,
	sortPublicProjects,
	type PublicProjectEntry,
} from '../../pages/research/projects/_project-helpers';

export function departmentProjectsPath(departmentId: string): string {
	return `/departments/${departmentId}/projects/`;
}

export function projectBelongsToDepartment(
	entry: PublicProjectEntry,
	departmentId: string,
): boolean {
	return entry.data.department_ids.includes(departmentId);
}

export function filterDepartmentProjects(
	entries: CollectionEntry<'projects'>[],
	departmentId: string,
): PublicProjectEntry[] {
	const publicForDept = entries.filter(
		(entry): entry is PublicProjectEntry =>
			isPublicProject(entry) && projectBelongsToDepartment(entry, departmentId),
	);
	return sortPublicProjects(publicForDept);
}

export const departmentProjectsPageCopy = {
	sectionTitle: 'Department projects',
	lede: 'Research projects linked to this department at build time via stable department identifiers.',
	emptyTitle: 'No projects for this department yet',
	emptyBody:
		'When approved project records include this department in their metadata, they will appear here with links to full project profiles on the research site.',
} as const;
