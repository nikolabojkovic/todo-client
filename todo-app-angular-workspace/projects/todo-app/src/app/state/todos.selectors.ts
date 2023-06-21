import { createFeatureSelector } from '@ngrx/store';
import { Todo } from '../shared/models/todo';

 
export const selectTodos = createFeatureSelector<ReadonlyArray<Todo>>('todos');
 
