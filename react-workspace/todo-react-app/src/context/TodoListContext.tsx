import { createContext, useContext, useReducer } from "react";
import { IAction } from "../models/Action";
import { IPaging } from "../models/IPaging";
import { IState, State } from "./IState";
import { ITodo } from "../models/Todo";
import { StateFilter } from "../models/IFilter";
 
export const TodosContext = createContext({} as IState);
export const TodosDispatchContext = createContext(null as any);

type Props = {
  children: JSX.Element | JSX.Element[],
  todoList: IState
}

export function TodoStateProvider({ todoList, children }: Props) {
  const [state, dispatch] = useReducer(
    todoStateReducer,
    todoList
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

function todoStateReducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'fetched': {
      return new State(action.payload.list)
    }
    case 'added': {
      const id = state.originalList.length >= 1 
      ? state.originalList
          .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[state.originalList.length - 1].id 
      : 0;
      const newTodo = {
        id: id + 1,
        title: action.payload.title,
        description: action.payload.description,
        completed: false, 
        createdAt: new Date()
      } as ITodo;

      return {
        ...state,
        originalList: [...state.originalList, newTodo],
        displayList: [...state.displayList, newTodo],
        updateTriger: { type: "added" },
        paging: {
          ...state.paging, 
          totalCount: state.paging.totalCount + 1,
          activePage: calculateActivePageOnAdd(state.paging),
          startIndex: (calculateActivePageOnAdd(state.paging) - 1) * state.paging.itemsPerPage,
          endIndex: calculateActivePageOnAdd(state.paging) * state.paging.itemsPerPage
        } as IPaging
      } as IState;
    }
    case 'changed': {
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
        updateTriger: { type: "changed" },
        paging: {...state.paging}
      } as IState;
    }
    case 'deleted': {
      return {
        ...state,
        originalList: state.originalList.filter(t => t.id !== action.payload.id),
        displayList: state.displayList.filter(t => t.id !== action.payload.id),
        updateTriger: { type: "deleted" },
        paging: {
          ...state.paging, 
          totalCount: state.paging.totalCount - 1,
          activePage: calculateActivePageOnDelete(state.paging),
          startIndex: (calculateActivePageOnDelete(state.paging) - 1) * state.paging.itemsPerPage,
          endIndex: calculateActivePageOnDelete(state.paging) * state.paging.itemsPerPage,  
        } as IPaging
      } as IState;
    }
    case 'paging-updated': {
      return {
        ...state,
        updateTriger: null,
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          itemsPerPage: action.payload.itemsPerPage,
          startIndex: (action.payload.activePage - 1) * action.payload.itemsPerPage,
          endIndex: action.payload.activePage * action.payload.itemsPerPage
        } as IPaging
      } as IState
    }
    case 'searched': {
      return {
        ...state,
        isLoading: false,
        updateTriger: null,
        displayList: [...action.payload.list],
        search: { searchTerm: action.payload.searchTerm },
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          totalCount: action.payload.list.length,
          startIndex: (action.payload.activePage - 1) * state.paging.itemsPerPage,
          endIndex: action.payload.activePage * state.paging.itemsPerPage
        } as IPaging
      }
    }
    case 'searchTerm-updated': {
      return {
        ...state,
        updateTriger: null,
        search: { searchTerm: action.payload.searchTerm },
      }
    }
    case 'filtered': {
      return {
        ...state,
        isLoading: false,
        updateTriger: null,
        displayList: [...action.payload.list],
        filter: {...action.payload.filter},
        paging: {
          ...state.paging,
          activePage: action.payload.activePage,
          totalCount: action.payload.list.length,
          startIndex: (action.payload.activePage - 1) * state.paging.itemsPerPage,
          endIndex: action.payload.activePage * state.paging.itemsPerPage
        } as IPaging
      }
    }
    case 'sorted': {
      return {
        ...state,
        isLoading: false,
        updateTriger: null,
        displayList: [...action.payload.list],
        sort: {...action.payload.sort},
        paging: {...state.paging} as IPaging
      }
    }
    case 'imported': {
      return {
        ...state,
        originalList: [...action.payload.list],
        displayList: [...action.payload.list],
        updateTriger: { type: "imported" },
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
      }
    }
    case 'loading-started': {
      return { 
        ...state,
        isLoading: true
      } as IState
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