/**
 * E4-S02 — Governed generic institutional pages (`src/content/pages/**`).
 * Interim JSON loaders (story `files_allowed` excludes `src/content.config.ts`).
 */
import overviewPage from '../../content/pages/about/overview.json';
import historyPage from '../../content/pages/about/history.json';

export type GenericPageMilestone = {
	id: string;
	year: string;
	title: string;
	description: string;
};

export type GenericPageRelatedLink = {
	label: string;
	href: string;
};

export type GenericPageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	template: 'generic' | 'timeline' | 'grid';
	eyebrow?: string;
	lede?: string;
	bodyParagraphs: string[];
	relatedLink?: GenericPageRelatedLink;
	milestones?: GenericPageMilestone[];
};

const pages: Record<string, GenericPageData> = {
	'about/overview': overviewPage as GenericPageData,
	'about/history': historyPage as GenericPageData,
};

export function getGenericPageData(pageId: keyof typeof pages): GenericPageData {
	const data = pages[pageId];
	if (!data) {
		throw new Error(`E4-S02: missing governed page content for "${pageId}"`);
	}
	return data;
}
