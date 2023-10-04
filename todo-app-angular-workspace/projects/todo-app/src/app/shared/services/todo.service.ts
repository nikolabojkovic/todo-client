import { Injectable } from '@angular/core';
import { initTodoList } from '../initial-data';
import { ITodoList, TodoList } from '../models/todoList';
import { ITodo } from '../models/todo';
import { Observable, of, throwError } from 'rxjs';

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
}