import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from './';

export const selectTodos = createFeatureSelector<IState>('todos');

export const selectTodoDisplayList = createSelector(
  selectTodos,
  (state: IState) => {
    if (state.settings.general.isPaginationEnabled)
      return state.displayList.slice(state.paging.startIndex, state.paging.endIndex);

    return state.displayList;
  }
);

export const selectPaging = createSelector(
  selectTodos,
  (state: IState) => state.paging
);

export const selectSort = createSelector(
  selectTodos,
  (state: IState) => state.sort
);

export const selectSearch = createSelector(
  selectTodos,
  (state: IState) => state.search
);

export const selectFilter = createSelector(
  selectTodos,
  (state: IState) => state.filter
);

export const selectLoader = createSelector(
  selectTodos,
  (state: IState) => state.isLoading
);

export const selectSettings = createSelector(
  selectTodos,
  (state: IState) => state.settings
);

export const selectActiveTab = createSelector(
  selectTodos,
  (state: IState) => state.activeTab
);

