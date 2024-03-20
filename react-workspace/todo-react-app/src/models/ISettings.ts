export interface ISettings {
	general: IGeneralSettings;
	pagination: IPaginationSettings;	
}

interface IGeneralSettings {
	confirmEnabled: boolean;
	paginationEnabled: boolean;
	infiniteScrollEnabled: boolean;
}

interface IPaginationSettings {
	paginationType: PaginationType;
	maxVisiblePages: number;
}

enum PaginationType {
	rotate = 'Rotate',
	clasic = 'Clasic'
}