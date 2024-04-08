import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { IFilter, StateFilter, ISort, SortDirection, ITodo } from '../models';
import { IStorageProvider, StorageProviderKey } from './';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoListName = 'todo-list';

  constructor(@Inject(StorageProviderKey) private localStorageProvider: IStorageProvider) {}

  getList(filter: IFilter | null = null , sort: ISort | null = null, searchTerm: string | null = null): Observable<ITodo[]> {
    return this.localStorageProvider.getItem(this.todoListName).pipe(map((todoListData) => {
      if (todoListData === ''
        || todoListData === undefined
        || todoListData === null) {
         return [] as ITodo[];
       }

       let todos = JSON.parse(todoListData) as ITodo[];

       if (filter) {
         todos = this.filter(todos, filter);
       }

       if (searchTerm) {
         todos = this.search(todos, searchTerm);
       }

       if (sort) {
         todos = this.sort(todos, sort);
       }

       return todos;
    }));
  }

  saveList(list: ITodo[]): Observable<unknown> {
    return this.localStorageProvider.setItem(this.todoListName, list);
  }

  private search(list: ITodo[], searchTerm: string,) {
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

  private filter(list: ITodo[], filter: IFilter) : ITodo[] {
    if (filter.state === StateFilter.completed) {
      return list.filter((todo: ITodo) => todo.completed === true);
    }

    if (filter.state === StateFilter.uncompleted) {
      return list.filter((todo: ITodo) => todo.completed === false);
    }

    return [...list];
  }

  private sort(list: ITodo[], sort: ISort) : ITodo[] {
    let sortResult = [];

    if (sort.column === 'createdAt') {
      if (sort.direction === 'asc') {
        sortResult = [...list.sort((a: ITodo , b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)];
      } else {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)];
      }

      return sortResult;
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
