/**
 * Aggregated navigation seeds (E2-S03).
 * Utility IA + labels: docs/02_design/03_ux_blueprint.md §4.1; route roots: docs/03_architecture/04_architecture.md §4.2.
 *
 * `routeLive`: when true, `UtilityNavigation.astro` emits a real `<a href>` (progressive enhancement). Set false for any
 * destination that is not yet stakeholder-approved for public navigation, or until the matching route exists under
 * `src/pages/` (PRD §30; architecture §19).
 */
export type UtilityNavId =
	| 'clinic'
	| 'drugAnalysisUnit'
	| 'downloads'
	| 'publications'
	| 'contact';

export type UtilityNavLinkSeed = {
	id: UtilityNavId;
	/** Visible label — must match UX blueprint §4.1 table */
	label: string;
	/** Canonical site path (trailing slash per architecture trailing-slash note) */
	href: string;
	external?: boolean;
	/** Set true when `src/pages` includes this destination and it is stakeholder-approved for public nav */
	routeLive: boolean;
};

export const utilityNavLinks: UtilityNavLinkSeed[] = [
	{
		id: 'clinic',
		label: 'Clinic',
		href: '/services/clinic/',
		routeLive: false,
	},
	{
		id: 'drugAnalysisUnit',
		label: 'Drug Analysis Unit',
		href: '/services/drug-analysis-unit/',
		routeLive: false,
	},
	{
		id: 'downloads',
		label: 'Downloads',
		href: '/resources/downloads/',
		routeLive: false,
	},
	{
		id: 'publications',
		label: 'Publications',
		href: '/research/publications/',
		routeLive: false,
	},
	{
		id: 'contact',
		label: 'Contact',
		href: '/contact/',
		routeLive: false,
	},
];

/** When true, Search is `<a href="/search/">`; when false, stub control until overlay/E11 (DESIGN.md §13.2). */
export const utilitySearchRouteLive = false;
