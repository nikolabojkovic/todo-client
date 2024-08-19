import { map } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

import { ITodo, IFilter, StateFilter, ISort, SortDirection } from "../models";
import providers from "./";

export type GetListProps = {
  filter: IFilter | null,
  sort: ISort | null,
  searchTerm: string | null,
}

const todoListName = 'todo-list';

export interface ITodoListProvider {
  getList({filter, sort, searchTerm}: GetListProps): Observable<ITodo[]>;
  saveList(list: ITodo[]): Observable<unknown>;
}

// additionaly implement one more provider, RemoteTodoListProvider which will load list from web api by invoking HTTP request

export class LocalTodoListProvider implements ITodoListProvider {

  getList({filter, sort, searchTerm}: GetListProps): Observable<ITodo[]> {
    return providers.storageProvider.getItem(todoListName).pipe(map((todoListData) => {
      if (todoListData === ''
        ||todoListData === undefined 
        || todoListData === null) {
         return [] as ITodo[];
       }
       
       let todos = JSON.parse(todoListData) as ITodo[];
   
       if (filter) {
         todos = this.filterList(todos, filter);
       }
   
       if (searchTerm) {
         todos = this.searchList(todos, searchTerm);
       }
   
       if (sort) {
         todos = this.sortList(todos, sort);
       }
   
       return todos;
    }));
  }
  
  saveList(list: ITodo[]): Observable<unknown> {
    return providers.storageProvider.setItem(todoListName, list);
  }

  private searchList(list: ITodo[], searchTerm: string): ITodo[] {
    return list.filter((todo: ITodo) => {
      const title = todo.title.trim()
                              .toLocaleLowerCase()
                              .includes(searchTerm.trim()
                              .toLocaleLowerCase());
  
      const description = todo.description.trim()
                                          .toLocaleLowerCase()
                                          .includes(searchTerm.trim()
                                          .toLocaleLowerCase());
  
      return title || description;
    });
  }

  private filterList(list: ITodo[], filter: IFilter) : ITodo[] {
    if (filter.state === StateFilter.completed) {
      return list.filter((todo: ITodo) => todo.completed === true);
    }
  
    if (filter.state === StateFilter.uncompleted) {
      return list.filter((todo: ITodo) => todo.completed === false);
    }
  
    return [...list];
  }

  private sortList(list: ITodo[], sort: ISort) : ITodo[] {
    let sortResult = [];
    
    if (sort.column === 'createdAt') {
      if (sort.direction === SortDirection.Asc) {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)];
      } else {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)];
      }
  
      return sortResult;
    }

    if (sort.column === 'sortId') {
      return sortResult = [...list.sort((a: ITodo, b: ITodo) => a.sortId > b.sortId ? 1 : -1)];
    }
  
    if (sort.direction === SortDirection.Asc) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] > b[sort.column] ? 1 : -1)];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] < b[sort.column] ? 1 : -1)];
    }
  
    return sortResult;
  }
}

export default new LocalTodoListProvider();