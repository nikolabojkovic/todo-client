import { createActionGroup, props } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { Todo } from '../shared/models/todo';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    retrievedTodoList: props<{ todoList: ITodoList }>(),
    addTodo: props<{ title: string, description: string }>(),
    completeTodo: props<{ todoId: number }>(),
    removeTodo: props<{ todoId: number }>()
  }
});