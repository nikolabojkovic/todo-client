import { createFeatureSelector } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
 
export const selectTodos = createFeatureSelector<ITodoList>('todos');
 
