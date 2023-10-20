import { Inject, Injectable } from '@angular/core';
import { ITodo } from '../models/todo';
import { map, Observable, of } from 'rxjs';
import { IFilter } from '../models/filter';
import { ISort, SortDirection } from '../models/sort';
import { IStorageProvider, StorageProviderKey } from './storage-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoListName = 'todo-list';

  constructor(@Inject(StorageProviderKey) private localStorageProvider: IStorageProvider) {}

  getList(filter: IFilter | null = null , sort: ISort | null = null, searchTerm: string | null = null): Observable<ITodo[]> {
    return this.localStorageProvider.getItem(this.todoListName).pipe(map((todoListData) => {
      if (todoListData === undefined 
        || todoListData === null) {
         return [] as ITodo[];
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
   
       return todos;
    }));
  }

  saveList(list: ITodo[]): Observable<any> {
    return this.localStorageProvider.setItem(this.todoListName, list);
  }

  private search(list: ITodo[], searchTerm: string,) {
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
        sortResult = [...list.sort((a: ITodo , b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)]
      } else {
        sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)]
      }
  
      return sortResult;
    }
  
    if (sort.direction === SortDirection.Asc) {
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] > b[sort.column] ? 1 : -1)]
    } else {
      sortResult = [...list.sort((a: any, b: any) => a[sort.column] < b[sort.column] ? 1 : -1)]
    }
  
    return sortResult;
  }
}