import { Injectable } from '@angular/core';
import { initTodoList } from '../initial-data';
import { IPaging } from '../models/IPaging';
import { ITodoList } from '../models/ITodoList';
import { ITodo, Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() {}

  getTodoList(): ITodoList {
    if (localStorage.getItem('todo-list') === undefined 
     || localStorage.getItem('todo-list') === null) {
      return initTodoList;
    }

    const sortBy = {
      column: 'createdAt',
      direction: 'asc'
    };
    const todos = JSON.parse(localStorage.getItem('todo-list') ?? "[]") as ITodo[];

    let todoList = {
      originalList: todos, 
      displayList: todos,
      search: {
        searchTerm: '',
      },
      filter: {
        completed: false,
        uncompleted: false,
      },
      sort: sortBy,
      paging: {
        totalCount: todos.length,
        activePage: todos.length > 0 ? 1 : 0,
        startIndex: 0,
        endIndex: 5,
        itemsPerPage: 5
      } as IPaging
    } as ITodoList;

    return todoList;
  }

  saveTodos(todoList: ITodoList): void {
    localStorage.setItem('todo-list', JSON.stringify(todoList.originalList));
  }
}