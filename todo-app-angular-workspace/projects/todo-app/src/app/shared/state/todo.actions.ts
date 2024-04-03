import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IFilter } from '../models/filter';
import { ITodo } from '../models/todo';
import { ISort } from '../models/sort';
import { IPaging } from '../models/paging';
import { ISettings } from '../models/settings';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetch: emptyProps(),
    settingsFetch: emptyProps(),
    pagingFetch: emptyProps(),
    filter: props<{ filter: IFilter }>(),
    search: props<{ search: string }>(),
    sort: props<{ sort: ISort }>(),

    fetched: props<{ list: ITodo[] }>(),
    searched: props<{ activePage: number, list: ITodo[] }>(),
    filtered: props<{ activePage: number, filter: IFilter, list: ITodo[] }>(),
    sorted: props< { sort: ISort, list: ITodo[] }>(),
    imported: props<{ activePage: number, list: ITodo[] }>(),
    loadingStarted: emptyProps(),
    activeTabChanged: props<{ activeTab: string }>(),

    searchTermUpdated: props< { searchTerm: string }>(),
    pagingFetched: props<{ paging: IPaging }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    settingsFetched: props<{ payload: ISettings }>(),
    settingsUpdated: props<{ payload: ISettings }>(),

    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
  }
});
