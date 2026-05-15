/**
 * E4-S07 — Governed Awards page (`src/content/pages/about/awards.json`).
 */
import awardsPage from '../../content/pages/about/awards.json';

export type AwardEntry = {
	id: string;
	title: string;
	/** ISO 8601 date or display year when full date is unavailable. */
	date: string;
	awardingBody?: string;
	summary?: string;
};

export type AwardsPageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	eyebrow?: string;
	lede?: string;
	awards: AwardEntry[];
	relatedLink?: {
		label: string;
		href: string;
	};
};

export function getAwardsPageData(): AwardsPageData {
	return awardsPage as AwardsPageData;
}
