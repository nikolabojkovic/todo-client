import { IFilter } from "./filter";
import { IPaging } from "./paging";
import { ISearch } from "./search";
import { ISort, SortDirection } from "./sort";
import { ITodo } from "./todo";

export interface ITodoList {
	originalList: ITodo[];
	displayList: ITodo[];
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;
}

export class TodoList implements ITodoList {
		originalList: ITodo[];
		displayList: ITodo[];
		search: ISearch;
		filter: IFilter;
		sort: ISort;
		paging: IPaging;

		constructor(todos: ITodo[]) {
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
        endIndex: 5,
        itemsPerPage: 5
      } as IPaging
		}
}