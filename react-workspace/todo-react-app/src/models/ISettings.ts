export interface ISettings {
	general: IGeneralSettings;
	search: ISearchSettings;
	pagination: IPaginationSettings;	
}

export interface IGeneralSettings {
	isConfirmEnabled: boolean;
	isPaginationEnabled: boolean;
	isInfiniteScrollEnabled: boolean;
	listSizeType: ListContainerType;
	fixedListSize: number;
}

export interface ISearchSettings {
	isSearchOnKeyPressEnabled: boolean;
	debounceTime: number;
}

export interface IPaginationSettings {
	paginationType: PaginationType;
	maxVisiblePages: number;
}

export enum PaginationType {
	Rotate = 'Rotate',
	Classic = 'Classic'
}

export enum ListContainerType {
	Fixed = 'Fixed',
	Dynamic = 'Dynamic'
}