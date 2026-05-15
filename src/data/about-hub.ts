/**
 * E4-S01 — About hub governed IA and intro copy (`src/content/about/hub.json`).
 * Subpage hrefs align with `src/data/navigation.ts` mega-nav seeds; `routeLive` gates public anchors.
 */
import hubContent from '../content/about/hub.json';

export type AboutHubSubpageLink = {
	id: string;
	label: string;
	href: string;
	description?: string;
	routeLive: boolean;
};

export type AboutHubNavGroup = {
	id: string;
	title: string;
	links: AboutHubSubpageLink[];
};

export type AboutHubData = {
	pageTitle: string;
	seoTitle: string;
	seoDescription: string;
	eyebrow?: string;
	introHeading?: string;
	introParagraphs: string[];
	inThisSectionLabel: string;
	subpagesSectionTitle: string;
	navGroups: AboutHubNavGroup[];
};

export function getAboutHubData(): AboutHubData {
	return hubContent as AboutHubData;
}

export function flattenAboutHubLinks(data: AboutHubData): AboutHubSubpageLink[] {
	return data.navGroups.flatMap((group) => group.links);
}

/** Trailing-slash policy matches `astro.config.mjs` and `Breadcrumbs.astro`. */
export function normalizeAboutPath(path: string): string {
	if (!path || path === '/') return '/';
	const trimmed = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
	return trimmed === '' ? '/' : trimmed;
}

export function aboutPathsEqual(a: string, b: string): boolean {
	return normalizeAboutPath(a) === normalizeAboutPath(b);
}

export function isAboutHubLinkCurrent(href: string, pathname: string): boolean {
	return aboutPathsEqual(href, pathname);
}
