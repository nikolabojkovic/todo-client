import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { todoListTestData } from "../context/testData";
import { IFilter } from "../models/IFilter";
import { IRange } from "../models/IPaging";
import { ISort } from "../models/ISort";
import { ITodo, Todo } from "../models/Todo";
import { LocalStorageProvider } from "./LocalStorageService";

export class TodoService {

  private todoListName: string = 'todo-list';

  constructor(private localStorageProvider: LocalStorageProvider) {

  }

  // TODO: include sort, filter and search in getAll Method, other methods in service should be private and invokted only from getAll method.
  getList(range: IRange = { offset: 0, take: 5 } as IRange, filter: IFilter | null = null , sort: ISort | null = null, searchTerm: string | null = null): Observable<ITodo[]> {
    let todoListData = this.localStorageProvider.getItem(this.todoListName);
    if (todoListData === undefined 
     || todoListData === null) {
      return of([] as ITodo[]);
    }
    
    let todos = JSON.parse(todoListData ?? "[]") as ITodo[];

    if (filter) {
      todos = this.filter(todos, filter);
    }

    if (searchTerm) {
      todos = this.search(todos, searchTerm);
    }

    if (sort) {
      todos = this.sort(todos, sort);
    }

    return of(todos);
  }

  // create(todo: Todo): Observable<void> {
  //   return of();
  // }

  // update(todo: Todo): Observable<Todo> {
  //   return of({} as Todo);
  // }

  // delete(id: number): Observable<void> {
  //   return of();
  // }

  saveList(list: ITodo[]): void {
    this.localStorageProvider.setItem(this.todoListName, list);
  }
  
  private search(list: ITodo[], searchTerm: string): ITodo[] {
    let filteredList = list;
  
    if (searchTerm !== '') {
      filteredList = list.filter((todo: ITodo) => 
        todo.title.trim()
                  .toLocaleLowerCase()
                  .includes(searchTerm.trim()
                                      .toLocaleLowerCase()) 
     || todo.description.trim()
                        .toLocaleLowerCase()
                        .includes(searchTerm.trim()
                                            .toLocaleLowerCase()));
    }
  
    return filteredList;
  }
  
  private filter(list: ITodo[], filter: IFilter) : ITodo[] {
    let filteredList = list;
  
    if (filter && filter.completed && filter.uncompleted) {
      return [...filteredList];
    }
  
    if (filter?.completed) {
      filteredList = filteredList.filter((todo: ITodo) => todo.completed === true);
    }
  
    if (filter?.uncompleted) {
      filteredList = filteredList.filter((todo: ITodo) => todo.completed === false);
    }
  
    return [...filteredList];
  }
  
  private sort(list: ITodo[], sort: ISort) : ITodo[] {
    let sortResult = [];
    
    if (sort.column === 'createdAt') {
      if (sort.direction === 'asc') {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)]
      } else {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)]
      }
  
      return sortResult;
    }
  
    if (sort.direction === 'asc') {
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] > b[sort.column] ? 1 : -1)]
    } else {
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] < b[sort.column] ? 1 : -1)]
    }
  
    return sortResult;
  }
}

export const todoServiceInstance = new TodoService(new LocalStorageProvider());