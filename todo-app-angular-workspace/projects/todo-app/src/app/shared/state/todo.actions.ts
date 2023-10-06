import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IFilter } from '../models/filter';
import { ITodoList } from '../models/todoList';
import { ITodo } from '../models/todo';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetch: emptyProps(),
    fetched: props<{ todoList: ITodoList }>(),
    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
    searched: props<{ searchTerm: string, activePage: number }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    filtered: props<{ activePage: number, filter: IFilter }>(),
    imported: props<{ activePage: number, originalList: ITodo[] }>(),
    sorted: props< { column: string, direction: string }>(),
    searchTermUpdated: props< { searchTerm: string }>()
  }
});