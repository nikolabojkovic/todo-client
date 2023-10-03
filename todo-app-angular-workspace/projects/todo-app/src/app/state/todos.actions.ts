import { createActionGroup, props } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { Todo } from '../shared/models/todo';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetched: props<{ todoList: ITodoList }>(),
    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
    searched: props<{ searchTerm: string, activePage: number }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    filtered: props<{ action: any }>(),
    imported: props<{ action: any }>(),
    sorted: props< { action: any }>(),
    searchTermUpdated: props< { searchTerm: string }>()
  }
});