import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from './state';

export const selectTodos = createFeatureSelector<IState>('todos');

export const selectTodoDisplayList = createSelector(
  selectTodos,
  (state: IState) => state.displayList.slice(state.paging.startIndex, state.paging.endIndex)
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

