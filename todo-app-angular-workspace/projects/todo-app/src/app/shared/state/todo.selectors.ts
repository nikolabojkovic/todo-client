import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPaging } from '../models/paging';
import { IState } from './state';
import { ITodo } from '../models/todo';
 
export const selectTodos = createFeatureSelector<IState>('todos');

// export const selectDisplayList = (state: ITodoList) => state.displayList;
// export const selectPaging = (state: ITodoList) => state.paging;

// export const selectTodoDisplayList = createSelector(
//   selectDisplayList,
//   selectPaging,
//   (displayList: ITodo[], paging: IPaging) => { 
//     console.log(paging);
//     return displayList.slice(paging.startIndex, paging.endIndex); }
// );

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
 
