/**
 * E4-S07 — Governed Partners page (`src/content/pages/about/partners.json`).
 */
import partnersPage from '../../content/pages/about/partners.json';

export type PartnerEntry = {
	name: string;
	/** Public URL path under `public/` (e.g. `/images/about/partners/foo.svg`). */
	logoPath: string;
	imageAlt: string;
	href?: string;
};

export type PartnersPageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	eyebrow?: string;
	lede?: string;
	bodyParagraphs?: string[];
	outboundPolicyText?: string;
	partners: PartnerEntry[];
	relatedLink?: {
		label: string;
		href: string;
	};
};

export function getPartnersPageData(): PartnersPageData {
	return partnersPage as PartnersPageData;
}
