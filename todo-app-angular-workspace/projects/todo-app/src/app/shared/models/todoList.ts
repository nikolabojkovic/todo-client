import { IFilter } from "./filter";
import { IPaging } from "./paging";
import { ISort } from "./sort";
import { ITodo } from "./todo";

export interface ITodoList {
	originalList: ITodo[];
	displayList: ITodo[];
	search: any;
	filter: IFilter;
	sort: ISort;
	paging: IPaging;
}