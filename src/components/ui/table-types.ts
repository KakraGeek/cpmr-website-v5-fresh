/** DESIGN.md §13.26 — shared Table prop types. */
export type TableColumn = {
	key: string;
	header: string;
	align?: 'start' | 'end' | 'center';
	numeric?: boolean;
};

export type TableCellValue =
	| string
	| number
	| {
			label: string;
			href: string;
	  };

export type TableRow = Record<string, TableCellValue>;
