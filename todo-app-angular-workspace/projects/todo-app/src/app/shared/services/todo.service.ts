import { Injectable } from '@angular/core';
import { todos as initialData } from '../initial-data';
import { ITodo, Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() {}

  getTodos(): Todo[] {
    if (localStorage.getItem('todo-list') === undefined 
     || localStorage.getItem('todo-list') === null) {
      return initialData;
    }

    const todoList = JSON.parse(localStorage.getItem('todo-list') ?? "[]") as ITodo[];
    return todoList;
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem('todo-list', JSON.stringify(todos));
  }
}