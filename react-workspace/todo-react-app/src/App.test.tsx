// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import App from './App';
import { TodosContext, TodosDispatchContext, stateTestData } from './context';
import { IAction, IFilter, ISort, SortDirection, StateFilter, TodoActions } from './models';
import { of } from 'rxjs';
import providers, { sortingLocalStorageKey } from './providers';

test('renders todo list text', () => {
  const context = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  render(
    <TodosContext.Provider value={context.state}>
      <TodosDispatchContext.Provider value={context.dispatch} >
        <App />
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>);

  const linkElement = screen.getByText(/todo list/i);
  
  expect(linkElement).toBeInTheDocument();
});

describe('todo list data', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };

  describe('load list', () => {
    const actionLoadingStarted = {
      type: TodoActions.loadingStarted
    } as IAction;
    const actionFetch = {
      type: TodoActions.fetch,
      payload: {
        sort: {
          column: 'createdAt',
          direction: SortDirection.Asc
        } as ISort
      }
    } as IAction;

    it('should fetch list', async () => {
      const context = {
        ...globalContext,
        dispatch: jest.fn(),
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.fetch, payload: actionFetch.payload },
          isLoading: true
        }
      };
      jest.spyOn(providers.todoListProvider, 'getList').mockImplementation(() => {
        return of(context.state.originalList);
      });

      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{"column": "sortId", "direction":"none"}');
      });

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);

      await act( async () => {
        render(jsxElement);
      });
  
      const actionFetched = {
        type: TodoActions.fetched,
        payload: {
          list: context.state.originalList,
          sort: {
            column: 'sortId',
            direction: SortDirection.None
          } as ISort
        }
      } as IAction;

      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(screen.getByTestId('loader')).toBeInTheDocument(); 
        expect(providers.storageProvider.getItem).toHaveBeenCalledWith('todo-sort'); 
        expect(context.dispatch).toBeCalledWith(actionFetch);
        expect(providers.todoListProvider.getList).toBeCalledWith({
          filter: globalContext.state.filter,
          searchTerm: globalContext.state.search.searchTerm,
          sort: actionFetched.payload.sort
        });
        expect(context.dispatch).toBeCalledWith(actionFetched);
      });
    });

    it('should fetch list with default sorting', async () => {
      const context = {
        ...globalContext,
        dispatch: jest.fn(),
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.fetch, payload: actionFetch.payload },
          isLoading: true
        }
      };
      jest.spyOn(providers.todoListProvider, 'getList').mockImplementation(() => {
        return of(context.state.originalList);
      });

      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of(null);
      });

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);

      await act( async () => {
        render(jsxElement);
      });
  
      const actionFetched = {
        type: TodoActions.fetched,
        payload: {
          list: context.state.originalList,
          sort: {
            column: 'createdAt',
            direction: SortDirection.Asc
          } as ISort
        }
      } as IAction;

      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(screen.getByTestId('loader')).toBeInTheDocument(); 
        expect(providers.storageProvider.getItem).toHaveBeenCalledWith('todo-sort'); 
        expect(context.dispatch).toBeCalledWith(actionFetch);
        expect(providers.todoListProvider.getList).toBeCalledWith({
          filter: globalContext.state.filter,
          searchTerm: globalContext.state.search.searchTerm,
          sort: actionFetch.payload.sort
        });
        expect(context.dispatch).toBeCalledWith(actionFetched);
      });
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

      jest.spyOn(providers.todoListProvider, 'getList').mockImplementation(() => {
        return of(expectedList);
      });

      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{"column":"createdAt", "direction":"asc"}');
      });

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);

       await act( async () => {
        render(jsxElement);
      });
  
      const actionFiltered = {
        type: TodoActions.filtered,
        payload: {
          activePage: 1,
          list: expectedList,
          filter: expectedActionPayload.filter
        }
      } as IAction;

      await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(providers.todoListProvider.getList).toBeCalledWith({...expectedActionPayload });
        expect(context.dispatch).toBeCalledWith(actionFetch);
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(context.dispatch).toBeCalledWith(actionFiltered);
      });      
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

      jest.spyOn(providers.todoListProvider, 'getList').mockImplementation(() => {
        return of(expectedList);
      });

      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{"column":"createdAt", "direction":"asc"}');
      });

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);

       await act( async () => {
        render(jsxElement);
      });
  
      const actionSearched = {
        type: TodoActions.searched,
        payload: {
          list: expectedList,
          activePage: 1,
        }
      } as IAction;

      await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(providers.todoListProvider.getList).toBeCalledWith({...expectedFilterActionPayload });            
        expect(context.dispatch).toBeCalledWith(actionFetch);
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(context.dispatch).toBeCalledWith(actionSearched);
      }); 
    });

    it('should sort list', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expectedList = [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)];
      const expectedFetchActionPayload = {
        filter: globalContext.state.filter,
        searchTerm: globalContext.state.search.searchTerm,
        sort: {
          column: 'title', 
          direction: SortDirection.Asc
        } as ISort
      };
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.sort, payload: expectedFetchActionPayload },
          isLoading: true
        }
      };

      jest.spyOn(providers.todoListProvider, 'getList').mockImplementation(() => {
        return of(expectedList);
      });

      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{"column":"createdAt", "direction":"asc"}');
      });
      
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);

       await act( async () => {
        render(jsxElement);
      });
  
      const actionSorted = {
        type: TodoActions.sorted,
        payload: {
          sort: expectedFetchActionPayload.sort,
          list: expectedList
        }
      } as IAction;

      await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(providers.todoListProvider.getList).toBeCalledWith({...expectedFetchActionPayload });
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(context.dispatch).toBeCalledWith(actionSorted);
      }); 
    });
  });

  describe('save list', () => {
    beforeEach(() => {
      jest.spyOn(providers.todoListProvider, 'saveList').mockImplementation(() => {
        return of({});
      });
  
      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{}');
      });
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
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(providers.todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
    });

    it('should save list when todo item added', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.added },
          isLoading: false
        }
      };

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(providers.todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
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

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(providers.todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
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

      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(providers.todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
    });
  });

  describe('save sorting', () => {
    it('should save sorting when todos sorted', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.sorted },
        }
      };
      jest.spyOn(providers.storageProvider, 'setItem').mockImplementation(() => {
        return of({});
      });
      jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(() => {
        return of('{"column":"createdAt", "direction":"asc"}');
      });
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <App />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(providers.storageProvider.setItem).toBeCalledWith(sortingLocalStorageKey, context.state.sort);
    });
  });
});
