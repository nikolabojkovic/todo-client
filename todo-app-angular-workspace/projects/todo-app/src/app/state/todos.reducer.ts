import { createReducer, on } from '@ngrx/store';

import { TodosActions } from './todos.actions';
import { Todo } from '../shared/models/todo';
import { todos } from '../shared/initial-data';

export const initialState: ReadonlyArray<Todo> = todos;
let id = 6;

export const todosReducer = createReducer(
  initialState,
  on(TodosActions.retrievedTodoList, (_state, { todos }) => todos),
  on(TodosActions.removeTodo, (state, { todoId }) =>
    state.filter((todo) => todo.id !== todoId)
  ),
  on(TodosActions.completeTodo, (state, { todoId }) => {
    return state.map(todo => {
      if (todo.id === todoId) {
        return {...todo, completed: true};
      } else {
        return todo;
      }
    })
  }
  ),
  on(TodosActions.addTodo, (state, { title, description } ) => {
    id = id + 1;
    const todo = {
      id,
      title,
      description, 
      completed: false,
      createdAt: new Date() 
    }
    return [...state, todo];
  })
);