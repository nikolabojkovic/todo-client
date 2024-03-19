import { IFilter } from '../models/filter';
import { IPaging } from '../models/paging';
import { ISearch } from '../models/search';
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
}

export class State implements IState {
    isLoading: boolean;
		originalList: ITodo[];
		displayList: ITodo[];
		search: ISearch;
		filter: IFilter;
		sort: ISort;
		paging: IPaging;

		constructor(todos: ITodo[]) {
			this.isLoading = false;
			this.originalList = todos;
      this.displayList = todos;
      this.search = {
        searchTerm: '',
      };
      this.filter = {
        completed: false,
        uncompleted: false,
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
		}
}
