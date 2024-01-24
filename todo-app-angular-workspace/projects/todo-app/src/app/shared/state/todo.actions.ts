import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IFilter } from '../models/filter';
import { ITodo } from '../models/todo';
import { ISort } from '../models/sort';
import { filter } from 'rxjs';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetch: emptyProps(),
    filter: props<{ filter: IFilter, sort: ISort, search: string }>(),
    search: props<{ filter: IFilter, sort: ISort, search: string }>(),
    sort: props<{ filter: IFilter, sort: ISort, search: string }>(),
    loadingStarted: emptyProps(),

    fetched: props<{ list: ITodo[] }>(),
    searched: props<{ searchTerm: string, activePage: number, list: ITodo[] }>(),
    filtered: props<{ activePage: number, filter: IFilter, list: ITodo[] }>(),
    sorted: props< { sort: ISort, list: ITodo[] }>(),

    imported: props<{ activePage: number, list: ITodo[] }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    searchTermUpdated: props< { searchTerm: string }>(),

    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
  }
});
