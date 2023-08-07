import { IPaging } from "./IPaging";
import { ITodo } from "./todo";

export interface ITodoList {
	originalList: ITodo[];
	displayList: ITodo[];
	search: any;
	filter: any;
	sort: any;
	paging: IPaging;
}