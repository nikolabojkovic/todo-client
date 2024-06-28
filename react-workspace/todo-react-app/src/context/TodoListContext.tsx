import { createContext, useContext, useReducer } from "react";

import { IAction, TodoActions, IPaging, ITodo, StateFilter, ISettings, ISort, SortDirection } from "../models";
import { DisplayMode, IState } from "./";
 
export const TodosContext = createContext({} as IState);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TodosDispatchContext = createContext(null as any);

type Props = {
  children: JSX.Element | JSX.Element[],
  initialState: IState
}

export function TodoStateProvider({ initialState, children }: Props) {
  const [state, dispatch] = useReducer(
    todoStateReducer,
    initialState
  );

  return (
    <TodosContext.Provider value={state}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  );
}

export function useTodoList() {
  return useContext(TodosContext);
}

export function useTodoListDispatch() {
  return useContext(TodosDispatchContext);
}

export default TodosDispatchContext.Provider;

export function todoStateReducer(state: IState, action: IAction) {
  switch (action.type) { 
    case TodoActions.loadingStarted: {
      return { 
        ...state,
        effectTrigger: null,
        isLoading: true
      } as IState;
    }
    case TodoActions.activeTabChanged: {
      return { 
        ...state,
        activeTab: action.payload.activeTab
      } as IState;
    }
    case TodoActions.fetch: {
      return { 
        ...state,
        effectTrigger: { type: TodoActions.fetch, payload: action.payload }, 
      } as IState;
    }
    case TodoActions.filter: {
      return { 
        ...state,
        effectTrigger: { type: TodoActions.filter, payload: action.payload },
        displayMode: DisplayMode.Filtered
      } as IState;
    }
    case TodoActions.search: {
      return { 
        ...state,
        effectTrigger: { type: TodoActions.search, payload: action.payload },
        displayMode: DisplayMode.Filtered
      } as IState;
    }
    case TodoActions.sort: {
      return { 
        ...state,
        effectTrigger: { type: TodoActions.sort, payload: action.payload },
      } as IState;
    }

    case TodoActions.fetched: {
      return {
        ...state,
        isLoading: false,
        originalList: action.payload.list,
        displayList: action.payload.list,
        effectTrigger: null,
        sort: action.payload.sort,
        paging: {
          ...state.paging,
          totalCount: action.payload.list.length,
          activePage: state.paging.activePage === 0 ? 1 : state.paging.activePage,
          itemsPerPage: state.paging.itemsPerPage,
          startIndex: ((state.paging.activePage === 0 ? 1 : state.paging.activePage) - 1) * state.paging.itemsPerPage,
          endIndex: (state.paging.activePage === 0 ? 1 : state.paging.activePage) * state.paging.itemsPerPage
        } as IPaging,
      };
    }
    case TodoActions.searched: {
      return {
        ...state,
        isLoading: false,
        effectTrigger: null,
        displayList: [...action.payload.list],
        displayMode: 
          state.filter.state === StateFilter.all && state.search.searchTerm === '' 
            ? DisplayMode.All 
            : DisplayMode.Filtered,
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          totalCount: action.payload.list.length,
          startIndex: (action.payload.activePage - 1) * state.paging.itemsPerPage,
          endIndex: action.payload.activePage * state.paging.itemsPerPage
        } as IPaging
      };
    }
    case TodoActions.filtered: {
      return {
        ...state,
        isLoading: false,
        effectTrigger: null,
        displayList: [...action.payload.list],
        displayMode: 
          action.payload.filter.state === StateFilter.all && state.search.searchTerm === '' 
            ? DisplayMode.All 
            : DisplayMode.Filtered,
        filter: {...action.payload.filter},
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          totalCount: action.payload.list.length,
          startIndex: (action.payload.activePage - 1) * state.paging.itemsPerPage,
          endIndex: action.payload.activePage * state.paging.itemsPerPage
        } as IPaging
      };
    }
    case TodoActions.sorted: {
      return {
        ...state,
        isLoading: false,
        effectTrigger: { type: TodoActions.sorted, payload: action.payload },
        originalList: [...action.payload.list],
        displayList: [...action.payload.list],
        sort: {...action.payload.sort},
        paging: {...state.paging} as IPaging
      };
    }
    case TodoActions.manuallySorted: {
      return { 
        ...state,
        effectTrigger: { type: TodoActions.manuallySorted, payload: action.payload },
        originalList: [...action.payload.list],
        displayList: [...action.payload.list],
        sort: {
          column: 'sortId', 
          direction: SortDirection.None
        } as ISort
      } as IState;
    }
    case TodoActions.imported: {
      return {
        ...state,
        originalList: [...action.payload.list],
        displayList: [...action.payload.list],
        effectTrigger: { type: TodoActions.imported },
        search: { searchTerm: '' },
        filter: {
          state: StateFilter.all
        },
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          totalCount: action.payload.list.length,
          startIndex: (action.payload.activePage - 1) * state.paging.itemsPerPage,
          endIndex: action.payload.activePage * state.paging.itemsPerPage
        } as IPaging
      };
    }

    case TodoActions.searchTermUpdated: {
      return {
        ...state,
        effectTrigger: null,
        search: { searchTerm: action.payload.searchTerm },
      };
    }    
    case TodoActions.pagingFatched: {
      return {
        ...state,
        effectTrigger: null,
        paging: { 
          ...state.paging,
          totalCount: action.payload.totalCount,
          activePage: action.payload.activePage,
          itemsPerPage: action.payload.itemsPerPage,
          startIndex: (action.payload.activePage - 1) * action.payload.itemsPerPage,
          endIndex: action.payload.activePage * action.payload.itemsPerPage
        } as IPaging
      } as IState;
    }
    case TodoActions.pagingUpdated: {
      return {
        ...state,
        effectTrigger: { type: TodoActions.pagingUpdated },
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          itemsPerPage: action.payload.itemsPerPage,
          startIndex: (action.payload.activePage - 1) * action.payload.itemsPerPage,
          endIndex: action.payload.activePage * action.payload.itemsPerPage
        } as IPaging
      } as IState;
    }
    case TodoActions.settingsFetched: {
      return {
        ...state,
        effectTrigger: null,
        settings: {
          ...action.payload
        } as ISettings
      };
    }
    case TodoActions.settingsUpdated: {
      return {
        ...state,
        effectTrigger: { type: TodoActions.settingsUpdated },
        settings: {
          ...action.payload
        } as ISettings
      };
    }

    case TodoActions.added: {
      const id = state.originalList.length >= 1 
      ? state.originalList
          .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[state.originalList.length - 1].id + 1
      : 1;
      const newTodo = {
        id: id ,
        title: action.payload.title,
        description: action.payload.description,
        completed: false, 
        createdAt: action.payload.createdAt,
        sortId: id
      } as ITodo;

      return {
        ...state,
        originalList: [...state.originalList, newTodo],
        displayList: [...state.displayList, newTodo],
        effectTrigger: { type: TodoActions.added },
        paging: {
          ...state.paging, 
          totalCount: state.paging.totalCount + 1,
          activePage: calculateActivePageOnAdd(state.paging),
          startIndex: (calculateActivePageOnAdd(state.paging) - 1) * state.paging.itemsPerPage,
          endIndex: calculateActivePageOnAdd(state.paging) * state.paging.itemsPerPage
        } as IPaging
      } as IState;
    }
    case TodoActions.changed: {
      return {
        ...state,
        originalList: state.originalList.map(t => {
          if (t.id === action.payload.todo.id) {
            return action.payload.todo;
          } else {
            return t;
          }
        }),
        displayList: state.displayList.map(t => {
          if (t.id === action.payload.todo.id) {
            return action.payload.todo;
          } else {
            return t;
          }
        }),
        effectTrigger: { type: TodoActions.changed },
        paging: {...state.paging}
      } as IState;
    }
    case TodoActions.deleted: {
      return {
        ...state,
        originalList: state.originalList.filter(t => t.id !== action.payload.id),
        displayList: state.displayList.filter(t => t.id !== action.payload.id),
        effectTrigger: { type: TodoActions.deleted },
        paging: {
          ...state.paging, 
          totalCount: state.paging.totalCount - 1,
          activePage: calculateActivePageOnDelete(state.paging),
          startIndex: (calculateActivePageOnDelete(state.paging) - 1) * state.paging.itemsPerPage,
          endIndex: calculateActivePageOnDelete(state.paging) * state.paging.itemsPerPage,  
        } as IPaging
      } as IState;
    }
    case TodoActions.restoredAll: {
      return {
        ...state,
        effectTrigger: { type: TodoActions.restoredAll },
        originalList: state.originalList.map(todo => ({...todo, completed: false})) as ITodo[],
        displayList: state.displayList.map(todo => ({...todo, completed: false})) as ITodo[],
        paging: {...state.paging}
      } as IState; 
    }
    case TodoActions.deletedAll: {
      return {
        ...state,
        effectTrigger: { type: TodoActions.deletedAll },
        originalList: [] as ITodo[],
        displayList: [] as ITodo[],
        paging: {
          ...state.paging,
          totalCount: 0,
          activePage: calculateActivePageOnDelete(state.paging),
          startIndex: (calculateActivePageOnDelete(state.paging) - 1) * state.paging.itemsPerPage,
          endIndex: calculateActivePageOnDelete(state.paging) * state.paging.itemsPerPage,
        } as IPaging
      } as IState;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function calculateActivePageOnDelete(paging: IPaging) {
  return Math.ceil((paging.totalCount - 1) / paging.itemsPerPage) < paging.activePage
    ? paging.activePage - 1 : paging.activePage;
}

function calculateActivePageOnAdd(paging: IPaging) {
  return Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) > paging.activePage
    ? Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) : paging.activePage;
}