export interface ISettings {
	general: IGeneralSettings;
	search: ISearchSettings;
	pagination: IPaginationSettings;
	theme: IThemeSettings;
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

export interface IThemeSettings {
	backgroundColor: BackgroundColor;
	primaryColor: string;
	bsTheme: BsThemes;
	primaryColorTopCord: number,
	primaryColorLefCord: number
}

export enum PaginationType {
	Rotate = 'Rotate',
	Classic = 'Classic'
}

export enum ListContainerType {
	Fixed = 'Fixed',
	Dynamic = 'Dynamic'
}

export enum BackgroundColor {
	DarkGray = 'dark-gray',
	DarkBlue = 'dark-blue',
	DarkRed = 'dark-red',
	LightGray = 'light-gray',
	LightBlue = 'light-blue',
	LightRed = 'light-red'
}

export enum BsThemes {
	Dark = 'dark',
	Light = 'light',
}

export const Themes = {
	dark: {
		gray: {
			backgroundPrimaryColor: "#282c34",
			backgroundSecondaryColor: "#444444",
			backgroundSecondaryColor1: "#4f4f4f",
			backgroundTernaryColor: "#5d5d5d",
			backgroundTernaryColor1: "#7e7d7d",
			backgroundTernaryColor2: "#6f6f6f",
		},
		blue: {
			backgroundPrimaryColor: "#282c34",
			backgroundSecondaryColor: "#0c1673",
			backgroundSecondaryColor1: "#0f1b8a",
			backgroundTernaryColor: "#111fa2",
			backgroundTernaryColor1: "#1324b9",
			backgroundTernaryColor2: "#1628d0",
		},
		red: {
			backgroundPrimaryColor: "#282c34",
			backgroundSecondaryColor: "#730c0c",
			backgroundSecondaryColor1: "#8a0f0f",
			backgroundTernaryColor: "#a21111",
			backgroundTernaryColor1: "#b91313",
			backgroundTernaryColor2: "#d01616",
		},
		
		textPrimaryColor: "white",
		textTernaryColor: "#767470",
		textTernaryColor2: "#A4A7AA",
	},
	light: {
		gray: {
			backgroundPrimaryColor: "white",
			backgroundSecondaryColor: "#ebebeb",
			backgroundSecondaryColor1: "#cfcfcf",
			backgroundTernaryColor: "#e0e0e0",
			backgroundTernaryColor1: "#cccccc",
			backgroundTernaryColor2: "#d3d2d2",
		},
		blue: {
			backgroundPrimaryColor: "white",
			backgroundSecondaryColor: "#eaecfa",
			backgroundSecondaryColor1: "#d5d9f6",
			backgroundTernaryColor: "#c1c5f1",
			backgroundTernaryColor1: "#acb2ec",
			backgroundTernaryColor2: "#979fe7",
		},
		red: {
			backgroundPrimaryColor: "white",
			backgroundSecondaryColor: "#faeaed",
			backgroundSecondaryColor1: "#f6d5db",
			backgroundTernaryColor: "#f1c1c9",
			backgroundTernaryColor1: "#ecacb8",
			backgroundTernaryColor2: "#e58e9e",
		},

		textPrimaryColor: "#282c34",
		textTernaryColor: "#A4A7AA",
		textTernaryColor2: "#313338",
	}
};