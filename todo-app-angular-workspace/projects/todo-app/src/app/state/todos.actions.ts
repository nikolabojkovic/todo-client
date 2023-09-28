import { createActionGroup, props } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { Todo } from '../shared/models/todo';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    retrievedTodoList: props<{ todoList: ITodoList }>(),
    addedTodo: props<{ title: string, description: string }>(),
    completedTodo: props<{ todoId: number }>(),
    removedTodo: props<{ todoId: number }>(),
    searchedTodos: props<{ action: any }>(),
    pagingUpdated: props<{ action: any }>(),
    todosFiltered: props<{ action: any }>(),
    todosImported: props<{ action: any}>(),
    sorted: props< { action:any }>()
  }
});