/**
 * Aggregated navigation seeds (E2-S03 utility; E2-S04 mega).
 * Utility IA + labels: docs/02_design/03_ux_blueprint.md §4.1; mega clusters §5.2; route roots: `04_architecture.md` §4.2.
 *
 * `routeLive`: when true, navigation components emit a real `<a href>`. Set false until the route exists under
 * `src/pages/` and is stakeholder-approved (PRD §30; architecture §19).
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

/** Optional footer rows inside the mobile drawer after primary IA (UX blueprint §6.1). Keep empty until routes exist. */
export type MobileDrawerSecondaryLink = {
	id: string;
	label: string;
	href: string;
	external?: boolean;
	routeLive: boolean;
};

export const mobileDrawerSecondaryLinks: MobileDrawerSecondaryLink[] = [];

/** Mega menu link seeds — stable `id` for future CMS mapping (E2-S04 QA). */
export type MegaNavLinkSeed = {
	id: string;
	label: string;
	href: string;
	routeLive: boolean;
};

export type MegaNavGroupSeed = {
	id: string;
	title: string;
	links: MegaNavLinkSeed[];
	viewAllHref?: string;
	viewAllRouteLive?: boolean;
};

export type MegaNavSection = {
	id: string;
	label: string;
	layoutVariant?: 'default' | 'wide';
	groups: MegaNavGroupSeed[];
};

export const megaNavSections: MegaNavSection[] = [
	{
		id: 'about',
		label: 'About CPMR',
		groups: [
			{
				id: 'about-identity',
				title: 'At a glance',
				links: [
					{ id: 'about-overview', label: 'Overview', href: '/about/', routeLive: false },
					{ id: 'about-history', label: 'History', href: '/about/history/', routeLive: false },
					{ id: 'about-mandate', label: 'Mandate', href: '/about/mandate/', routeLive: false },
					{ id: 'about-vision', label: 'Vision & Mission', href: '/about/vision-mission/', routeLive: false },
					{ id: 'about-leadership', label: 'Leadership', href: '/about/leadership/', routeLive: false },
				],
			},
			{
				id: 'about-governance',
				title: 'Governance & recognition',
				links: [
					{ id: 'about-board', label: 'Board Members', href: '/about/board/', routeLive: false },
					{ id: 'about-management', label: 'Management Team', href: '/about/management/', routeLive: false },
					{
						id: 'about-structure',
						label: 'Organisational Structure',
						href: '/about/organisation-structure/',
						routeLive: false,
					},
					{ id: 'about-awards', label: 'Awards & Recognition', href: '/about/awards/', routeLive: false },
					{ id: 'about-partners', label: 'Partners & Affiliations', href: '/about/partners/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'research',
		label: 'Research',
		layoutVariant: 'wide',
		groups: [
			{
				id: 'research-programme',
				title: 'Programme',
				links: [
					{ id: 'research-overview', label: 'Research Overview', href: '/research/', routeLive: false },
					{ id: 'research-themes', label: 'Research Themes', href: '/research/themes/', routeLive: false },
					{ id: 'research-projects', label: 'Research Projects', href: '/research/projects/', routeLive: false },
					{ id: 'research-publications', label: 'Publications', href: '/research/publications/', routeLive: false },
				],
			},
			{
				id: 'research-people',
				title: 'People & collaboration',
				links: [
					{ id: 'research-profiles', label: 'Researcher Profiles', href: '/research/staff/', routeLive: false },
					{ id: 'research-facilities', label: 'Research Facilities', href: '/research/facilities/', routeLive: false },
					{ id: 'research-collab', label: 'Collaboration', href: '/research/collaboration/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'departments',
		label: 'Departments',
		layoutVariant: 'wide',
		groups: [
			{
				id: 'departments-index',
				title: 'Departments',
				links: [
					{ id: 'departments-home', label: 'Department Index', href: '/departments/', routeLive: false },
					{
						id: 'departments-research',
						label: 'Research Departments',
						href: '/departments/research/',
						routeLive: false,
					},
					{
						id: 'departments-service',
						label: 'Service Departments',
						href: '/departments/services/',
						routeLive: false,
					},
					{
						id: 'departments-admin',
						label: 'Administrative Departments',
						href: '/departments/administrative/',
						routeLive: false,
					},
					{
						id: 'departments-contacts',
						label: 'Department Contacts',
						href: '/departments/contacts/',
						routeLive: false,
					},
				],
			},
		],
	},
	{
		id: 'services',
		label: 'Services',
		groups: [
			{
				id: 'services-clinical',
				title: 'Clinical & laboratory',
				links: [
					{ id: 'services-clinic', label: 'Clinic', href: '/services/clinic/', routeLive: false },
					{ id: 'services-dau', label: 'Drug Analysis Unit', href: '/services/drug-analysis-unit/', routeLive: false },
					{
						id: 'services-aeu',
						label: 'Animal Experimentation Unit',
						href: '/services/animal-experimentation/',
						routeLive: false,
					},
					{ id: 'services-nursery', label: 'Nursery / Seedlings', href: '/services/nursery/', routeLive: false },
					{ id: 'services-library', label: 'Library', href: '/services/library/', routeLive: false },
				],
			},
			{
				id: 'services-business',
				title: 'Industry & information',
				links: [
					{ id: 'services-industry', label: 'Industry Services', href: '/services/industry/', routeLive: false },
					{ id: 'services-fees', label: 'Service Fees', href: '/services/fees/', routeLive: false },
					{ id: 'services-faqs', label: 'FAQs', href: '/services/faqs/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'products',
		label: 'Products',
		groups: [
			{
				id: 'products-catalogue',
				title: 'Range',
				links: [
					{ id: 'products-overview', label: 'Product Overview', href: '/products/', routeLive: false },
					{ id: 'products-capsules', label: 'Capsules', href: '/products/capsules/', routeLive: false },
					{ id: 'products-decoctions', label: 'Decoctions', href: '/products/decoctions/', routeLive: false },
					{ id: 'products-ointments', label: 'Ointments', href: '/products/ointments/', routeLive: false },
				],
			},
			{
				id: 'products-more',
				title: 'More formats',
				links: [
					{ id: 'products-powders', label: 'Powders', href: '/products/powders/', routeLive: false },
					{ id: 'products-roots', label: 'Roots', href: '/products/roots/', routeLive: false },
					{ id: 'products-teas', label: 'Teas', href: '/products/teas/', routeLive: false },
					{ id: 'products-enquiries', label: 'Product Enquiries', href: '/products/enquiries/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'news-events',
		label: 'News & Events',
		groups: [
			{
				id: 'news-events-hub',
				title: 'News & events',
				links: [
					{ id: 'news-latest', label: 'Latest News', href: '/news/', routeLive: false },
					{ id: 'news-announcements', label: 'Announcements', href: '/announcements/', routeLive: false },
					{ id: 'news-events-cal', label: 'Events Calendar', href: '/events/', routeLive: false },
					{ id: 'news-gallery', label: 'Media Gallery', href: '/media/', routeLive: false },
					{ id: 'news-videos', label: 'Videos', href: '/media/videos/', routeLive: false },
					{ id: 'news-press', label: 'Press Resources', href: '/news/press/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'resources',
		label: 'Resources',
		groups: [
			{
				id: 'resources-library',
				title: 'Resources',
				links: [
					{ id: 'res-downloads', label: 'Downloads', href: '/resources/downloads/', routeLive: false },
					{ id: 'res-reports', label: 'Annual Reports', href: '/resources/annual-reports/', routeLive: false },
					{ id: 'res-forms', label: 'Forms', href: '/resources/forms/', routeLive: false },
					{ id: 'res-brochures', label: 'Brochures', href: '/resources/brochures/', routeLive: false },
					{ id: 'res-policies', label: 'Policies', href: '/resources/policies/', routeLive: false },
					{ id: 'res-faqs', label: 'FAQs', href: '/resources/faqs/', routeLive: false },
					{ id: 'res-pubs-archive', label: 'Publications Archive', href: '/resources/publications/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'careers',
		label: 'Careers & Opportunities',
		groups: [
			{
				id: 'careers-paths',
				title: 'Careers & opportunities',
				links: [
					{ id: 'careers-jobs', label: 'Jobs', href: '/careers/', routeLive: false },
					{ id: 'careers-intern', label: 'Internships', href: '/careers/internships/', routeLive: false },
					{ id: 'careers-attach', label: 'Attachments', href: '/careers/attachments/', routeLive: false },
					{ id: 'careers-ns', label: 'National Service', href: '/careers/national-service/', routeLive: false },
					{ id: 'careers-procure', label: 'Procurement / Tenders', href: '/careers/procurement/', routeLive: false },
				],
			},
		],
	},
	{
		id: 'contact',
		label: 'Contact',
		groups: [
			{
				id: 'contact-channels',
				title: 'Contact',
				links: [
					{ id: 'contact-general', label: 'General Contact', href: '/contact/', routeLive: false },
					{ id: 'contact-dept', label: 'Department Contacts', href: '/contact/departments/', routeLive: false },
					{ id: 'contact-clinic', label: 'Clinic Contact', href: '/contact/clinic/', routeLive: false },
					{ id: 'contact-dau', label: 'DAU Contact', href: '/contact/drug-analysis-unit/', routeLive: false },
					{ id: 'contact-map', label: 'Location Map', href: '/contact/location/', routeLive: false },
					{ id: 'contact-hours', label: 'Office Hours', href: '/contact/hours/', routeLive: false },
				],
			},
		],
	},
];
