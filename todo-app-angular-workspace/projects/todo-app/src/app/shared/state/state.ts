import {
  IFilter,
  StateFilter,
  IPaging,
  ISearch,
  IGeneralSettings,
  IPaginationSettings,
  ISearchSettings,
  ISettings,
  ListContainerType,
  PaginationType,
  ITodo,
  ISort,
  SortDirection
} from '../models';

export enum DisplayMode {
	All,
	Filtered
}

export interface IState {
	isLoading: boolean;
	originalList: ITodo[];
	displayList: ITodo[];
	displayMode: DisplayMode;
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;
  settings: ISettings;
	activeTab: string;
}

export class State implements IState {
    isLoading: boolean;
		originalList: ITodo[];
		displayList: ITodo[];
    displayMode: DisplayMode;
		search: ISearch;
		filter: IFilter;
		sort: ISort;
		paging: IPaging;
    settings: ISettings;
    activeTab: string;

		constructor(todos: ITodo[]) {
			this.isLoading = false;
			this.originalList = todos;
      this.displayList = todos;
      this.displayMode = DisplayMode.All;
      this.search = {
        searchTerm: '',
      };
      this.filter = {
        state: StateFilter.all,
      } as IFilter;
      this.sort = {
        column: 'id',
        direction: SortDirection.Asc
			} as ISort;
      this.paging = {
        totalCount: todos.length,
        activePage: todos.length > 0 ? 1 : 0,
        startIndex: 0,
        endIndex: todos.length > 5 ? 5 : todos.length,
        itemsPerPage: 5
      } as IPaging;
      this.settings = {
        general: {
          isConfirmEnabled: true,
          isPaginationEnabled: true,
          isInfiniteScrollEnabled: false,
          listSizeType: ListContainerType.Dynamic,
          fixedListSize: 200
        } as IGeneralSettings,
        search: {
          isSearchOnKeyPressEnabled: false,
          debounceTime: 500
        } as ISearchSettings,
        pagination: {
          paginationType: PaginationType.Classic,
          maxVisiblePages: 3
        } as IPaginationSettings
      } as ISettings;
      this.activeTab = 'add-todo';
		}
}
