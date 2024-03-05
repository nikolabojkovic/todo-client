import { ITodo } from "../models/Todo";
import { IPaging } from "../models/IPaging";
import { IFilter } from "../models/IFilter";
import { ISort, SortDirection } from "../models/ISort";
import { ISearch } from "../models/ISearch";
import { StateFilter } from '../models/IFilter'


export interface IState {
	isLoading: boolean;
	originalList: ITodo[];
	displayList: ITodo[];
	effectTrigger: any | null;
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;
}

export class State implements IState {
	isLoading: boolean;
	originalList: ITodo[];
	displayList: ITodo[];
	effectTrigger: any | null;
	search: ISearch;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;

	constructor(todos: ITodo[]) {
		this.isLoading = false;
		this.originalList = todos; 
		this.displayList = todos;
		this.effectTrigger = null;
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
		} as IPaging
	}
}
