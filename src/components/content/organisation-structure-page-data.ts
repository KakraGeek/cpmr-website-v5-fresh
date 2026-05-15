/**
 * E4-S06 — Governed organisational structure page (`src/content/pages/about/organisation.json`).
 */
import organisationPage from '../../content/pages/about/organisation.json';

export type OrganisationOutlineNode = {
	id: string;
	label: string;
	note?: string;
	children?: OrganisationOutlineNode[];
};

export type OrganisationStructurePageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	eyebrow?: string;
	lede?: string;
	diagram: {
		src: string;
		width: number;
		height: number;
		alt: string;
		caption: string;
	};
	linearisedOutline: {
		heading: string;
		intro?: string;
		nodes: OrganisationOutlineNode[];
	};
	relatedLink?: {
		label: string;
		href: string;
	};
};

export function getOrganisationStructurePageData(): OrganisationStructurePageData {
	return organisationPage as OrganisationStructurePageData;
}
