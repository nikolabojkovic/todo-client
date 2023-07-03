import { createReducer, on } from '@ngrx/store';

import { TodosActions } from './todos.actions';
import { Todo } from '../shared/models/todo';

export const initialState: ReadonlyArray<Todo> = [];

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
    let lastElement = state[state.length - 1];
    let id = 0;
    if (lastElement) {
      id = lastElement.id + 1;
    }
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