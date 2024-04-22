export interface ISort {
	column: string;
	direction: SortDirection;
}

export enum SortDirection {
	None = 'none',
	Asc = 'asc',
	Desc = 'desc'
}

export enum SortType {
  direction = 'direction',
  noDirection = 'no-direction'
}
