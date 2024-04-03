import { IFilter, StateFilter } from '../models/filter';
import { IPaging } from '../models/paging';
import { ISearch } from '../models/search';
import { IGeneralSettings, IPaginationSettings, ISearchSettings, ISettings, ListContainerType, PaginationType } from '../models/settings';
import { ISort, SortDirection } from '../models/sort';
import { ITodo } from '../models/todo';

export interface IState {
	isLoading: boolean;
	originalList: ITodo[];
	displayList: ITodo[];
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
      this.search = {
        searchTerm: '',
      };
      this.filter = {
        state: StateFilter.all,
      } as IFilter;
      this.sort = {
				column: 'createdAt',
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
