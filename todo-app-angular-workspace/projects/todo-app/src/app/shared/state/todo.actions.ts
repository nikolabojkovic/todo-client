import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IFilter } from '../models/filter';
import { ITodo } from '../models/todo';
import { ISort } from '../models/sort';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetch: emptyProps(),
    fetched: props<{ list: ITodo[] }>(),
    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
    searched: props<{ searchTerm: string, activePage: number, list: ITodo[] }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    filtered: props<{ activePage: number, filter: IFilter, list: ITodo[] }>(),
    imported: props<{ activePage: number, list: ITodo[] }>(),
    sorted: props< { sort: ISort, list: ITodo[] }>(),
    searchTermUpdated: props< { searchTerm: string }>(),
    loadingStarted: emptyProps(),
  }
});
