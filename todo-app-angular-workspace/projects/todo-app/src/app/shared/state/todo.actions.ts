import { createActionGroup, props, emptyProps } from '@ngrx/store';

import {
  IFilter,
  ITodo,
  ISort,
  IPaging,
  ISettings
} from '../models';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    loadingStarted: emptyProps(),
    activeTabChanged: props<{ activeTab: string }>(),
    fetch: emptyProps(),
    settingsFetch: emptyProps(),
    pagingFetch: emptyProps(),
    filter: props<{ filter: IFilter }>(),
    search: props<{ search: string }>(),
    sort: props<{ sort: ISort }>(),

    fetched: props<{ list: ITodo[], sort: ISort }>(),
    searched: props<{ activePage: number, list: ITodo[] }>(),
    filtered: props<{ activePage: number, filter: IFilter, list: ITodo[] }>(),
    sorted: props< { sort: ISort, list: ITodo[] }>(),
    manuallySorted: props<{ list: ITodo[] }>(),
    imported: props<{ activePage: number, list: ITodo[] }>(),

    searchTermUpdated: props< { searchTerm: string }>(),
    pagingFetched: props<{ paging: IPaging }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    settingsFetched: props<{ payload: ISettings }>(),
    settingsUpdated: props<{ payload: ISettings }>(),

    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    restored: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
    restoredAll: emptyProps(),
    removedAll: emptyProps(),
  }
});
