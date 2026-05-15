/**
 * E4-S03 — Governed Vision & Mission page (`src/content/pages/about/vision-mission.json`).
 */
import visionMissionPage from '../../content/pages/about/vision-mission.json';

export type VisionMissionStatement = {
	title: string;
	paragraphs: string[];
};

export type VisionMissionPageData = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	editorialStatus: 'draft' | 'in_review' | 'approved' | 'archived';
	contentOwnerRole: 'super_admin' | 'content_admin';
	eyebrow?: string;
	lede?: string;
	vision: VisionMissionStatement;
	mission: VisionMissionStatement;
	relatedLink?: {
		label: string;
		href: string;
	};
};

export function getVisionMissionPageData(): VisionMissionPageData {
	return visionMissionPage as VisionMissionPageData;
}
