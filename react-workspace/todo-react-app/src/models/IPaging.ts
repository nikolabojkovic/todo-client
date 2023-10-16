
export interface IPaging {
	totalCount: number;
	activePage: number;
	itemsPerPage: number;
	startIndex: number;
	endIndex: number;
}

export interface IRange {
	offset: number;
	take: number;
}
