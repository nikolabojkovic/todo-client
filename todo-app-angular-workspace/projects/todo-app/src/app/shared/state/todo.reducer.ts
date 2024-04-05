import { createReducer, on } from '@ngrx/store';

import { IState, State, TodoListActions } from './';
import { IPaging, ITodo, StateFilter, ISettings } from '../models';

export const initialState: IState = new State([] as ITodo[]);

export const todosReducer = createReducer(
  initialState,

  on(TodoListActions.loadingStarted, (state) => {
    return {
      ...state,
      isLoading: true
    } as IState;
  }),
  on(TodoListActions.activeTabChanged, (state, { activeTab }) => {
    return {
      ...state,
      activeTab
    } as IState;
  }),
  on(TodoListActions.fetched, (state, { list }) => {
    return {
      ...state,
      isLoading: false,
      originalList: list,
      displayList: list,
      paging: {
        ...state.paging,
        totalCount: list.length,
        activePage: 1,
        itemsPerPage: 5,
        startIndex: 0,
        endIndex: 5
      } as IPaging,
    };
  }),
  on(TodoListActions.searched, (todoList, { activePage, list }) => {
    return {
      ...todoList,
      isLoading: false,
      displayList: [...list],
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as IState;
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
    } as IState;
  }),
  on(TodoListActions.sorted, (todoList, {sort, list} ) => {
    return {
      ...todoList,
      isLoading: false,
      displayList: [...list],
      sort: {...sort},
      paging: {...todoList.paging} as IPaging
    } as IState;
  }),
  on(TodoListActions.imported, (todoList, { activePage, list }) => {
    return {
      ...todoList,
      originalList: [...list],
      displayList: [...list],
      search: { searchTerm: '' },
      filter: {
        state: StateFilter.all
      },
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),

  on(TodoListActions.searchTermUpdated, (todoList, { searchTerm }) => {
    return {
      ...todoList,
      search: { searchTerm },
    };
  }),
  on(TodoListActions.pagingFetched, (state, { paging }) => {
    return {
      ...state,
      paging: {
        ...state.paging,
        totalCount: paging.totalCount,
        activePage: paging.activePage,
        itemsPerPage: paging.itemsPerPage,
        startIndex: (paging.activePage - 1) * paging.itemsPerPage,
        endIndex: paging.activePage * paging.itemsPerPage
      } as IPaging
    } as IState;
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
    } as IState;
  }),
  on(TodoListActions.settingsFetched,(state, { payload }) => {
    return {
      ...state,
      settings: {
        ...payload
      } as ISettings
    };
  }),
  on(TodoListActions.settingsUpdated, (todoList, { payload }) => {
    return {
      ...todoList,
      settings: {
        ...payload
      } as ISettings
    };
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
    };
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
);

function calculateActivePageOnDelete(paging: IPaging) {
  return Math.ceil((paging.totalCount - 1) / paging.itemsPerPage) < paging.activePage
    ? paging.activePage - 1 : paging.activePage;
}

function calculateActivePageOnAdd(paging: IPaging) {
  return Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) > paging.activePage
    ? Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) : paging.activePage;
}
