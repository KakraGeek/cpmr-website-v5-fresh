/**
 * E2-S06 — Footer IA (UX blueprint §23; DESIGN.md §13.5).
 * Column link sets mirror approved mega-nav seeds (`navigation.ts`); no link IDs outside that graph.
 */
import { megaNavSections, type MegaNavLinkSeed } from './navigation';

export type FooterLink = {
	id: string;
	label: string;
	href: string;
	external?: boolean;
	routeLive: boolean;
};

export type FooterColumn = {
	id: string;
	title: string;
	links: FooterLink[];
};

/** DESIGN.md §13.5 — contact surfacing; fields optional for honest omission. */
export type FooterContact = {
	address: string[];
	phone?: string;
	email?: string;
	mapHref?: string;
	hours?: string[];
};

export type FooterMetaLink = {
	id: string;
	label: string;
	href: string;
	external?: boolean;
	routeLive: boolean;
};

function findMegaLinkById(linkId: string): MegaNavLinkSeed | undefined {
	for (const section of megaNavSections) {
		for (const group of section.groups) {
			const found = group.links.find((l) => l.id === linkId);
			if (found) return found;
		}
	}
	return undefined;
}

/**
 * Curated footer columns — titles align with UX blueprint §23.1; each `linkId` must exist in mega nav.
 * Mirrors mega IA (blueprint §5.3 / §23.3) without introducing new destinations.
 */
const FOOTER_COLUMN_SPECS: { id: string; title: string; linkIds: string[] }[] = [
	{
		id: 'footer-about',
		title: 'About',
		linkIds: ['about-overview', 'about-mandate', 'about-leadership', 'about-partners'],
	},
	{
		id: 'footer-services',
		title: 'Services',
		linkIds: ['services-clinic', 'services-dau', 'services-fees', 'services-faqs'],
	},
	{
		id: 'footer-research',
		title: 'Research',
		linkIds: ['research-projects', 'research-publications', 'research-facilities'],
	},
	{
		id: 'footer-resources',
		title: 'Resources',
		linkIds: ['res-downloads', 'res-reports', 'res-policies'],
	},
	{
		id: 'footer-news',
		title: 'News & media',
		linkIds: ['news-latest', 'news-events-cal', 'news-gallery', 'news-press'],
	},
	{
		id: 'footer-careers',
		title: 'Careers',
		linkIds: ['careers-jobs', 'careers-intern', 'careers-ns'],
	},
];

function buildFooterColumns(): FooterColumn[] {
	return FOOTER_COLUMN_SPECS.map((spec) => {
		const links: FooterLink[] = [];
		for (const linkId of spec.linkIds) {
			const seed = findMegaLinkById(linkId);
			if (!seed) {
				throw new Error(`footer.ts: mega nav missing link id "${linkId}" for column "${spec.id}"`);
			}
			links.push({
				id: seed.id,
				label: seed.label,
				href: seed.href,
				routeLive: seed.routeLive,
			});
		}
		return { id: spec.id, title: spec.title, links };
	});
}

export const footerColumns: FooterColumn[] = buildFooterColumns();

/** Institution framing only; no unverified phone/email (PRD / architecture §19). */
export const footerContact: FooterContact = {
	address: [
		'Centre for Plant Medicine Research',
		'Full postal address and departmental phone listings will be published once editorial sign-off is complete.',
	],
};

export const footerCopyrightYear = 2026;

/** Legal name for meta row; keep in data for editorial/CMS handoff. */
export const footerCopyrightLegalName = 'Centre for Plant Medicine Research';

/** Meta row — same routeLive discipline as primary nav. */
export const footerMetaLinks: FooterMetaLink[] = [
	{ id: 'footer-meta-accessibility', label: 'Accessibility', href: '/accessibility/', routeLive: false },
	{ id: 'footer-meta-sitemap', label: 'Sitemap', href: '/sitemap/', routeLive: false },
];

/** Official channels only — empty omits the social row per DESIGN.md §13.5. */
export const footerSocialLinks: { platform: string; href: string; label: string }[] = [];
