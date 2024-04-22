import { createReducer, on } from '@ngrx/store';

import { DisplayMode, IState, State, TodoListActions } from './';
import { IPaging, ITodo, StateFilter, ISettings, SortDirection, ISort } from '../models';

export const initialState: IState = new State([] as ITodo[]);

export const todosReducer = createReducer(
  initialState,
  on(TodoListActions.filter, (state) => {
    return {
      ...state,
      displayMode: DisplayMode.Filtered
    } as IState;
  }),
  on(TodoListActions.search, (state) => {
    return {
      ...state,
      displayMode: DisplayMode.Filtered
    } as IState;
  }),

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
  on(TodoListActions.fetched, (state, { list, sort }) => {
    return {
      ...state,
      isLoading: false,
      originalList: list,
      displayList: list,
      sort,
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
  on(TodoListActions.searched, (state, { activePage, list }) => {
    return {
      ...state,
      isLoading: false,
      displayList: [...list],
      displayMode:
        state.filter.state === StateFilter.all && state.search.searchTerm === ''
          ? DisplayMode.All
          : DisplayMode.Filtered,
      paging: {
        ...state.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * state.paging.itemsPerPage,
        endIndex: activePage * state.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),
  on(TodoListActions.filtered, (state, { activePage, filter, list }) => {
    return {
      ...state,
      isLoading: false,
      displayList: [...list],
      displayMode:
        filter.state === StateFilter.all && state.search.searchTerm === ''
          ? DisplayMode.All
          : DisplayMode.Filtered,
      filter: {...filter},
      paging: {
        ...state.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * state.paging.itemsPerPage,
        endIndex: activePage * state.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),
  on(TodoListActions.sorted, (state, {sort, list} ) => {
    return {
      ...state,
      isLoading: false,
      displayList: [...list],
      originalList: [...list],
      sort: {...sort},
      paging: {...state.paging} as IPaging
    } as IState;
  }),
  on(TodoListActions.manuallySorted, (state, {list} ) => {
    return {
      ...state,
      originalList: [...list],
      displayList: [...list],
      sort: {
        column: 'sortId',
        direction: SortDirection.None
      } as ISort
    } as IState;
  }),
  on(TodoListActions.imported, (state, { activePage, list }) => {
    return {
      ...state,
      originalList: [...list],
      displayList: [...list],
      search: { searchTerm: '' },
      filter: {
        state: StateFilter.all
      },
      paging: {
        ...state.paging,
        activePage: activePage,
        totalCount: list.length,
        startIndex: (activePage - 1) * state.paging.itemsPerPage,
        endIndex: activePage * state.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),

  on(TodoListActions.searchTermUpdated, (state, { searchTerm }) => {
    return {
      ...state,
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
  on(TodoListActions.pagingUpdated, (state, { activePage, itemsPerPage }) => {
    return {
      ...state,
      paging: {
        ...state.paging,
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
  on(TodoListActions.settingsUpdated, (state, { payload }) => {
    return {
      ...state,
      settings: {
        ...payload
      } as ISettings
    };
  }),

  on(TodoListActions.added, (state, { title, description } ) => {
    const id = state.originalList.length >= 1
    ? [...state.originalList]
        .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[state.originalList.length - 1].id
    : 0;
    const newTodo = {
      id: id + 1,
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    return {
      ...state,
      originalList: [...state.originalList, newTodo],
      displayList: [...state.displayList, newTodo],
      paging: {
        ...state.paging,
        totalCount: state.paging.totalCount + 1,
        activePage: calculateActivePageOnAdd(state.paging),
        startIndex: (calculateActivePageOnAdd(state.paging) - 1) * state.paging.itemsPerPage,
        endIndex: calculateActivePageOnAdd(state.paging) * state.paging.itemsPerPage
      } as IPaging
    } as IState;
  }),
  on(TodoListActions.completed, (state, { todoId }) => {
    return {
      ...state,
      originalList: state.originalList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      displayList: state.displayList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      paging: {...state.paging}
    } as IState;
  }),
  on(TodoListActions.removed, (state, { todoId }) => {
    return {
      ...state,
      originalList: state.originalList.filter(t => t.id !== todoId) as ITodo[],
      displayList: state.displayList.filter(t => t.id !== todoId) as ITodo[],
      paging: {
        ...state.paging,
        totalCount: state.paging.totalCount - 1,
        activePage: calculateActivePageOnDelete(state.paging),
        startIndex: (calculateActivePageOnDelete(state.paging) - 1) * state.paging.itemsPerPage,
        endIndex: calculateActivePageOnDelete(state.paging) * state.paging.itemsPerPage,
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
