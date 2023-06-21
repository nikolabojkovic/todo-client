import { Injectable } from '@angular/core';
import { todos } from '../initial-data';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() {}

  getTodos(): Todo[] {
    // TODO: load todos from local storage
    return todos;
  }
}