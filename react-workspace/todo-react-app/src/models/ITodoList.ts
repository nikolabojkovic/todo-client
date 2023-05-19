import { ITodo } from "./Todo";
import { IPaging } from "./IPaging";


export interface ITodoList {
	originalList: ITodo[];
	displayList: ITodo[];
	search: any;
	filter: any;
	sort: any;
	paging: IPaging;
}
