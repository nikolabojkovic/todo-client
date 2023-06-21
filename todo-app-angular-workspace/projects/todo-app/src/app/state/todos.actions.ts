import { createActionGroup, props } from '@ngrx/store';
import { Todo } from '../shared/models/todo';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    retrievedTodoList: props<{ todos: ReadonlyArray<Todo> }>(),
    addTodo: props<{ title: string, description: string }>(),
    completeTodo: props<{ todoId: number }>(),
    removeTodo: props<{ todoId: number }>()
  }
});