import { IPaging } from "./models/paging";
import { SortDirection } from "./models/sort";
import { ITodoList } from "./models/todoList";
import { ITodo } from "./models/todo";

export const todos: ITodo[] = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: false,
    createdAt: new Date(2022, 1, 4)
  } as ITodo,
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    completed: true,
    createdAt: new Date(2022, 1, 5)
  } as ITodo,
  {
    id: 3,
    title: "Task 3",
    description: "Description 3",
    completed: false,
    createdAt: new Date(2022, 1, 6)
  } as ITodo,
  {
    id: 4,
    title: "Task 4",
    description: "Description 4",
    completed: false,
    createdAt: new Date(2022, 1, 7)
  } as ITodo,
  {
    id: 5,
    title: "Task 5",
    description: "Description 5",
    completed: false,
    createdAt: new Date(2022, 3, 8)
  } as ITodo,
  {
    id: 6,
    title: "Task 6",
    description: "Description 6",
    completed: false,
    createdAt: new Date(2022, 2, 4)
  } as ITodo
] as ITodo[];

export const initTodoList: ITodoList = 
{
  originalList: todos,
  displayList: todos,
  search: { searchTerm: '' },
  filter: { completed: false, uncompleted: false },
  sort: { column: 'createdAt', direction: SortDirection.Asc},
  paging: {
    totalCount: 6,
    activePage: 1,
    itemsPerPage: 5,
    startIndex: 0,
    endIndex: 5,
  } as IPaging
};