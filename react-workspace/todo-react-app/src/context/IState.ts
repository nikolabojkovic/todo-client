import { ITodo } from "../models/Todo";
import { IPaging } from "../models/IPaging";
import { IFilter } from "../models/IFilter";
import { ISort, SortDirection } from "../models/ISort";
import { ISearch } from "../models/ISearch";


export interface IState {
	originalList: ITodo[];
	displayList: ITodo[];
	updateTriger: any | null;
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;
}

export class State implements IState {
	originalList: ITodo[];
	displayList: ITodo[];
	updateTriger: any | null;
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;

	constructor(todos: ITodo[]) {
		this.originalList = todos; 
		this.displayList = todos;
		this.updateTriger = null;
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
