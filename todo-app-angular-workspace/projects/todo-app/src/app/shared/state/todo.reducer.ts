import { createReducer, on } from '@ngrx/store';

import { TodoListActions } from './todo.actions';
import { IState, State } from './state';
import { IPaging } from '../models/paging';
import { ITodo } from '../models/todo';

export const initialState: IState = new State([] as ITodo[]);

export const todosReducer = createReducer(
  initialState,
  on(TodoListActions.fetched, (_state, { list }) =>{
    return {
      ...new State(list)
    } as IState
  }),
  on(TodoListActions.added, (todoList, { title, description } ) => {
    const id = todoList.originalList.length >= 1
    ? [...todoList.originalList]
        .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[todoList.originalList.length - 1].id
    : 0;
    const newTodo = {
      id: id + 1,
      title,
      description,
      completed: false,
      createdAt: new Date()
    }
    return {
      ...todoList,
      originalList: [...todoList.originalList, newTodo],
      displayList: [...todoList.displayList, newTodo],
      paging: {
        ...todoList.paging,
        totalCount: todoList.paging.totalCount + 1,
        activePage: calculateActivePageOnAdd(todoList.paging),
        startIndex: (calculateActivePageOnAdd(todoList.paging) - 1) * todoList.paging.itemsPerPage,
        endIndex: calculateActivePageOnAdd(todoList.paging) * todoList.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),
  on(TodoListActions.completed, (todoList, { todoId }) => {
    return {
      ...todoList,
      originalList: todoList.originalList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      displayList: todoList.displayList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      paging: {...todoList.paging}
    } as IState;
  }),
  on(TodoListActions.removed, (todoList, { todoId }) => {
    return {
      ...todoList,
      originalList: todoList.originalList.filter(t => t.id !== todoId) as ITodo[],
      displayList: todoList.displayList.filter(t => t.id !== todoId) as ITodo[],
      paging: {
        ...todoList.paging,
        totalCount: todoList.paging.totalCount - 1,
        activePage: calculateActivePageOnDelete(todoList.paging),
        startIndex: (calculateActivePageOnDelete(todoList.paging) - 1) * todoList.paging.itemsPerPage,
        endIndex: calculateActivePageOnDelete(todoList.paging) * todoList.paging.itemsPerPage,
      } as IPaging
    } as IState;
  }
  ),
  on(TodoListActions.searched, (todoList, { searchTerm, activePage, list }) => {
    return {
      ...todoList,
      isLoading: false,
      displayList: [...list],
      search: { searchTerm: searchTerm },
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as IState
  }),
  on(TodoListActions.filtered, (todoList, { activePage, filter, list }) => {
    return {
      ...todoList,
      isLoading: false,
      displayList: [...list],
      filter: {...filter},
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as IState
  }),
  on(TodoListActions.pagingUpdated, (todoList, { activePage, itemsPerPage }) => {
    return {
      ...todoList,
      paging: {
        ...todoList.paging,
        activePage: activePage,
        itemsPerPage: itemsPerPage,
        startIndex: (activePage - 1) * itemsPerPage,
        endIndex: activePage * itemsPerPage
      } as IPaging
    } as IState
  }),
  on(TodoListActions.imported, (todoList, { activePage, list }) => {
    return {
      ...todoList,
      originalList: [...list],
      displayList: [...list],
      search: { searchTerm: '' },
      filter: {
        completed: false,
        uncompleted: false
       },
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as IState
  }),
  on(TodoListActions.sorted, (todoList, {sort, list} ) => {
    return {
      ...todoList,
      isLoading: false,
      displayList: [...list],
      sort: {...sort},
      paging: {...todoList.paging} as IPaging
    } as IState
  }),
  on(TodoListActions.searchTermUpdated, (todoList, { searchTerm }) => {
    return {
      ...todoList,
      search: { searchTerm },
    }
  }),
  on(TodoListActions.loadingStarted, (_state, { }) =>{
    return {
      ..._state,
      isLoading: true
    } as IState
  }),
);

function calculateActivePageOnDelete(paging: IPaging) {
  return Math.ceil((paging.totalCount - 1) / paging.itemsPerPage) < paging.activePage
    ? paging.activePage - 1 : paging.activePage;
}

function calculateActivePageOnAdd(paging: IPaging) {
  return Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) > paging.activePage
    ? Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) : paging.activePage;
}
