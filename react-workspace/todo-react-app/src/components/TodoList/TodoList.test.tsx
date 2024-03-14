import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { IAction, TodoActions } from '../../models/Action';
import { ISort, SortDirection } from '../../models/ISort';
import { of } from 'rxjs';
import { IFilter, StateFilter } from '../../models/IFilter';
import { MockLocalStorageProvider } from '../../Mocks/LocalStorageProvider.mock';

describe('todo list rendered', () => {
  const fromMockedApi = {
    getList: jest.fn().mockImplementation(() => of([])), // spred operator does not pick mockImplementation for some reason
    saveList: jest.fn().mockImplementation(() => of({})), // spred operator does not pick mockImplementation for some reason
    localStorageProvider: new MockLocalStorageProvider()
  };
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };

  it('match snapshot list', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false 
      }
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...fromMockedApi} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('match snapshot loader', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: true 
      }
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...fromMockedApi} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('load list', () => {
    const actionLoadingStarted = {
      type: TodoActions.loadingStarted
    } as IAction;
    const actionFetch = {
      type: TodoActions.fetch,
      payload: {
        sort: {
          column: 'createdAt',
          direction: 'asc'
        } as ISort
      }
    } as IAction;

    it('should fetch list', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.fetch, payload: actionFetch.payload },
          isLoading: true
        }
      };
      const api = {
        ...fromMockedApi,
        getList: jest.fn().mockImplementation(() => of(context.state.originalList)),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionFetched = {
        type: TodoActions.fetched,
        payload: {
          list: context.state.originalList
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(api.getList).toBeCalledWith({ provider: api.localStorageProvider, ...actionFetch.payload} );
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
      expect(context.dispatch).toBeCalledWith(actionFetch);      
      expect(context.dispatch).toBeCalledWith(actionFetched);
    });

    it('should filter list', async () => {
      const expectedList = stateTestData.displayList.filter(x => x.completed);
      const expectedActionPayload = {
        filter: { 
          state: StateFilter.completed
        } as IFilter, 
        sort: stateTestData.sort,
        searchTerm: stateTestData.search.searchTerm
      };
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.filter, payload: expectedActionPayload },
          isLoading: true
        }
      };
      const api = {
        ...fromMockedApi,
        getList: jest.fn().mockImplementation(() => of(expectedList)),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionFiltered = {
        type: TodoActions.filtered,
        payload: {
          activePage: 1,
          list: expectedList,
          filter: expectedActionPayload.filter
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(api.getList).toBeCalledWith({ provider: api.localStorageProvider, ...expectedActionPayload });
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
      expect(context.dispatch).toBeCalledWith(actionFetch);
      expect(context.dispatch).toBeCalledWith(actionFiltered);
    });

    it('should search list', async () => {
      const expectedList = stateTestData.displayList.filter(x => x.title === 'Task 1');
      const expectedFilterActionPayload = {
        filter: stateTestData.filter, 
        sort: stateTestData.sort,
        searchTerm: "Task 1"
      };

      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.search, payload: expectedFilterActionPayload },
          isLoading: true
        }
      };
      const api = {
        ...fromMockedApi,
        getList: jest.fn().mockImplementation(() => of(expectedList)),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionSearched = {
        type: TodoActions.searched,
        payload: {
          searchTerm: expectedFilterActionPayload.searchTerm,
          list: expectedList,
          activePage: 1,
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(api.getList).toBeCalledWith({ provider: api.localStorageProvider, ...expectedFilterActionPayload });
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
      expect(context.dispatch).toBeCalledWith(actionFetch);
      expect(context.dispatch).toBeCalledWith(actionSearched);
    });

    it('should sort list', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expectedList = [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)];
      const expectedActionPayload = {
        filter: stateTestData.filter, 
        sort: {
          column: 'title', 
          direction: SortDirection.Asc
        } as ISort,
        searchTerm: stateTestData.search.searchTerm
      };
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.sort, payload: expectedActionPayload },
          isLoading: true
        }
      };
      const api = {
        ...fromMockedApi,
        getList: jest.fn().mockImplementation(() => of(expectedList)),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionSorted = {
        type: TodoActions.sorted,
        payload: {
          sort: expectedActionPayload.sort,
          list: expectedList
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(api.getList).toBeCalledWith({ provider: api.localStorageProvider, ...expectedActionPayload });
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
      expect(context.dispatch).toBeCalledWith(actionFetch);
      expect(context.dispatch).toBeCalledWith(actionSorted);
    });
  });

  describe("save list", () => {
    it('should save list when todo item added', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.added },
          isLoading: false
        }
      };
      const api = {
        ...fromMockedApi,
        saveList: jest.fn().mockImplementation(() => of({})),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(api.saveList).toBeCalledWith(api.localStorageProvider, stateTestData.originalList);
    });

    it('should save list when todo item changed', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.changed },
          isLoading: false
        }
      };
      const api = {
        ...fromMockedApi,
        saveList: jest.fn().mockImplementation(() => of({})),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(api.saveList).toBeCalledWith(api.localStorageProvider, stateTestData.originalList);
    });

    it('should save list when todo item deleted', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.deleted },
          isLoading: false
        }
      };
      const api = {
        ...fromMockedApi,
        saveList: jest.fn().mockImplementation(() => of({})),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(api.saveList).toBeCalledWith(api.localStorageProvider, stateTestData.originalList);
    });

    it('should save list when todo item imported', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.imported },
          isLoading: false
        }
      };
      const api = {
        ...fromMockedApi,
        saveList: jest.fn().mockImplementation(() => of({})),
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList {...api} />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(api.saveList).toBeCalledWith(api.localStorageProvider, stateTestData.originalList);
    });
  });
});
