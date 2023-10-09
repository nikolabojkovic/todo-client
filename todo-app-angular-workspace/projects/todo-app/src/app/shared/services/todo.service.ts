import { Injectable } from '@angular/core';
import { initTodoList } from '../initial-data';
import { ITodoList, TodoList } from '../models/todoList';
import { ITodo } from '../models/todo';
import { Observable, of, throwError } from 'rxjs';
import { IFilter } from '../models/filter';
import { ISort, SortDirection } from '../models/sort';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoListName = 'todo-list';

  constructor() {}

  getTodoList(): Observable<ITodoList> {
    // return throwError(() => new Error('Test'));
    // return of (new TodoList([] as ITodo[]));
    let todoListData = localStorage.getItem(this.todoListName);
    if (todoListData === undefined 
     || todoListData === null) {
      return of(initTodoList);
    }
    const todos = JSON.parse(todoListData ?? "[]") as ITodo[];
    let todoList = new TodoList(todos);

    return of(todoList);
  }

  saveTodos(todoList: ITodoList): void {
    localStorage.setItem(this.todoListName, JSON.stringify(todoList.originalList));
  }

  search(list: ITodo[], searchTerm: string,) {
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
  
  filter(list: ITodo[], filter: IFilter) : ITodo[] {
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
  
  sort(list: ITodo[], sort: ISort) : ITodo[] {
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