import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPaging } from '../shared/models/paging';
import { ITodoList } from '../shared/models/todoList';
import { ITodo } from '../shared/models/todo';
 
export const selectTodos = createFeatureSelector<ITodoList>('todos');

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
  (state: ITodoList) => state.displayList.slice(state.paging.startIndex, state.paging.endIndex)
);

export const selectPaging = createSelector(
  selectTodos,
  (state: ITodoList) => state.paging
);

export const selectSort = createSelector(
  selectTodos,
  (state: ITodoList) => state.sort
);

export const selectSearch = createSelector(
  selectTodos,
  (state: ITodoList) => state.search
);

export const selectFilter = createSelector(
  selectTodos,
  (state: ITodoList) => state.filter
);
 
