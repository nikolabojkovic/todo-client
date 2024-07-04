import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { of } from 'rxjs';

import { TodoList } from './TodoList';
import { TodosContext, TodosDispatchContext, stateTestData } from '../../context';
import { IAction, TodoActions, ISort, SortDirection, IFilter, StateFilter, Todo } from '../../models';

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: any) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }: any) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }: any) => children,
}));

import { LocalStorageProvider } from '../../providers/StorageProvider';
jest.mock('../../providers/StorageProvider');
// const mockGetItem = jest.fn().mockImplementation(() => of('{"column":"title", "direction":"Asc"}'));
// const mockSetItem = jest.fn().mockImplementation(() => of({}));
// const mockGetItem = jest.fn();
// const mockSetItem = jest.fn();
let getItemMock = jest
.spyOn(LocalStorageProvider.prototype, 'getItem')
.mockImplementation(() => {
  return of('{"column":"title", "direction":"Asc"}');
}); // comment this line if just want to "spy"

let todoListProvider = {
  getList: jest.fn().mockImplementation(() => of([] as Todo[])),
  saveList: jest.fn().mockImplementation(() => of({})),
};

beforeAll(() => {

  // const mockGetItem = jest.fn().mockImplementation(() => of('{"column":"title", "direction":"Asc"}'));
  // const mockSetItem = jest.fn().mockImplementation(() => of({}));
  // jest.mock('../../providers/StorageProvider', () => {
  //   return jest.fn().mockImplementation(() => { 
  //     return { 
  //       getItem: mockGetItem, 
  //       setItem: mockSetItem
  //     };
  //   });
  // });
});

beforeEach(() => {
  todoListProvider = {
    getList: jest.fn().mockImplementation(() => of([] as Todo[])),
    saveList: jest.fn().mockImplementation(() => of({})),
  };
  
  getItemMock.mockClear();
  getItemMock = jest
    .spyOn(LocalStorageProvider.prototype, 'getItem')
    .mockImplementation(() => {
      return of('{"column":"createdAt", "direction":"asc"}');
    });
});

describe('todo list rendered', () => {  
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
          <TodoList />
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
          <TodoList />
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
          direction: SortDirection.Asc
        } as ISort
      }
    } as IAction;

    it('should fetch list', (done) => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          effectTrigger: { type: TodoActions.fetch, payload: actionFetch.payload },
          isLoading: true
        }
      };
      todoListProvider = {
        ...todoListProvider,
        getList: jest.fn().mockImplementation(() => of(context.state.originalList))
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
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

      expect(screen.getByTestId('loader')).toBeInTheDocument();     
      expect(context.dispatch).toBeCalledWith(actionFetch); 
      expect(getItemMock).toHaveBeenCalledWith('todo-sort');
      (getItemMock.getMockImplementation()!)('').subscribe(() => {
        expect(context.dispatch).toBeCalledWith(actionFetch);
        expect(todoListProvider.getList).toBeCalledWith({
          filter: globalContext.state.filter,
          searchTerm: globalContext.state.search.searchTerm,
          sort: actionFetch.payload.sort
        });
        expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
        expect(context.dispatch).toBeCalledWith(actionFetched);
        done();
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
      todoListProvider = {
        ...todoListProvider,
        getList: jest.fn().mockImplementation(() => of(expectedList))
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList />
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
      expect(todoListProvider.getList).toBeCalledWith({...expectedActionPayload });
      expect(context.dispatch).toBeCalledWith(actionFetch);
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
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
      todoListProvider = {
        ...todoListProvider,
        getList: jest.fn().mockImplementation(() => of(expectedList).pipe())
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionSearched = {
        type: TodoActions.searched,
        payload: {
          list: expectedList,
          activePage: 1,
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(todoListProvider.getList).toBeCalledWith({...expectedFilterActionPayload });            
      expect(context.dispatch).toBeCalledWith(actionFetch);
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
      expect(context.dispatch).toBeCalledWith(actionSearched);
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
      todoListProvider = {
        ...todoListProvider,
        getList: jest.fn().mockImplementation(() => of(expectedList))
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const actionSorted = {
        type: TodoActions.sorted,
        payload: {
          sort: expectedFetchActionPayload.sort,
          list: expectedList
        }
      } as IAction;

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(todoListProvider.getList).toBeCalledWith({...expectedFetchActionPayload });
      expect(context.dispatch).toBeCalledWith(actionLoadingStarted);
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
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
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
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
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
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
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
          <TodoList />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      expect(todoListProvider.saveList).toBeCalledWith(stateTestData.originalList);
    });
  });
});
