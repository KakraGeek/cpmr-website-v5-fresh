/**
 * E4-S05 — Governed Board / Management pages (`src/content/pages/about/board.json`, `management.json`).
 */
import boardPage from '../../content/pages/about/board.json';
import managementPage from '../../content/pages/about/management.json';
import type { TableColumn, TableRow } from '../ui/table-types';

export type GovernanceTableBlock = {
	caption: string;
	captionVisible?: boolean;
	columns: TableColumn[];
	rows: TableRow[];
	responsive?: 'stack' | 'scroll';
	lastUpdated?: string;
};

export type GovernanceTablePageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	eyebrow?: string;
	lede?: string;
	tables: GovernanceTableBlock[];
	relatedLink?: {
		label: string;
		href: string;
	};
};

const pages: Record<'about/board' | 'about/management', GovernanceTablePageData> = {
	'about/board': boardPage as GovernanceTablePageData,
	'about/management': managementPage as GovernanceTablePageData,
};

export function getGovernanceTablePageData(
	pageId: keyof typeof pages,
): GovernanceTablePageData {
	const data = pages[pageId];
	if (!data) {
		throw new Error(`E4-S05: missing governed governance page content for "${pageId}"`);
	}
	return data;
}
