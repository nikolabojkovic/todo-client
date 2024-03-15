import { IAction, TodoActions } from "../models/Action";
import { IFilter, StateFilter } from "../models/IFilter";
import { IPaging } from "../models/IPaging";
import { ISort, SortDirection } from "../models/ISort";
import { ITodo } from "../models/Todo";
import { State } from "./IState";
import { todoStateReducer } from "./TodoListContext";
import { stateTestData } from "./testData";

describe('TodoListContext', () => {
  describe('todoListReducer', () => {
    it('should execute case filter', () => {
      const action = {
        type: TodoActions.filter,
        payload: {
          filter: { 
            state: StateFilter.completed
          } as IFilter, 
          sort: stateTestData.sort,
          searchTerm: stateTestData.search.searchTerm
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.filter, payload: action.payload }
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case search', () => {
      const action = {
        type: TodoActions.search,
        payload: {
          filter: stateTestData.filter, 
          sort: stateTestData.sort,
          searchTerm: 'Task 1'
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.search, payload: action.payload }
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case fetched', () => {
      const action = {
        type: TodoActions.fetched,
        payload: {
          list: stateTestData.originalList
        }
      } as IAction;
      const expectedState = new State(stateTestData.originalList);

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case searched', () => {
      const action = {
        type: TodoActions.searched,
        payload: {
          searchTerm: 'Task 1',
          list: stateTestData.displayList.filter(x => x.title === 'Task 1'),
          activePage: 1,
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        isLoading: false,
        displayList: stateTestData.displayList.filter(x => x.title === 'Task 1'),
        search: { searchTerm: 'Task 1'},
        paging: {
          ...stateTestData.paging,
          activePage: 1,
          totalCount: 1,
          startIndex: 0,
          endIndex: 5
        }
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case filtered', () => {
      const action = {
        type: TodoActions.filtered,
        payload: {
          filter: { state: StateFilter.completed },
          list: stateTestData.displayList.filter(x => x.completed),
          activePage: 1,
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        isLoading: false,
        displayList: stateTestData.displayList.filter(x => x.completed),
        filter: { state: StateFilter.completed },
        paging: {
          ...stateTestData.paging,
          activePage: 1,
          totalCount: 1,
          startIndex: 0,
          endIndex: 5
        }
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case sorted', () => {
      const action = {
        type: TodoActions.sorted,
        payload: {
          sort: {
            column: 'title', 
            direction: SortDirection.Asc
          } as ISort,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list: [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)],
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        displayList: [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)],
        sort: {
          column: 'title', 
          direction: SortDirection.Asc
        } as ISort,
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case imported', () => {
      const action = {
        type: TodoActions.imported,
        payload: {
          list: stateTestData.originalList,
          activePage: 1
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.imported },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        displayList: [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)],
        filter: {
          state: StateFilter.all
        } as IFilter,
        search: { searchTerm: '' },
        paging: {
          ...stateTestData.paging,
          activePage: 1,
          totalCount: 6,
          startIndex: 0,
          endIndex: 5
        } as IPaging
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case searchTermUpdated', () => {
      const action = {
        type: TodoActions.searchTermUpdated,
        payload: {
          searchTerm: 'Task 1',
          activePage: 1
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        search: { searchTerm: 'Task 1' },
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case changed', () => {
      const expectedTodo = {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: true,
        createdAt: new Date(2022, 1, 4)
      } as ITodo;
      const action = {
        type: TodoActions.changed,
        payload: {
          todo: {...stateTestData.originalList[0], completed: true}
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.changed },
        originalList: [
          expectedTodo,
          ...stateTestData.originalList.filter(x => x.id !== 1)          
        ],
        displayList: [
          expectedTodo,
          ...stateTestData.originalList.filter(x => x.id !== 1)    
        ]
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case deleted', () => {
      const action = {
        type: TodoActions.deleted,
        payload: {
          id: 1
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.deleted },
        originalList: [
          ...stateTestData.originalList.filter(x => x.id !== 1)          
        ],
        displayList: [
          ...stateTestData.originalList.filter(x => x.id !== 1)    
        ],
        paging: {
          ...stateTestData.paging,
          totalCount: 5
        }
      };

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case deleted and active page should change', () => {
      const state = { 
        ...stateTestData,
        paging: {
          ...stateTestData.paging,
          activePage: 2
        }
      };
      const action = {
        type: TodoActions.deleted,
        payload: {
          id: 6
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.deleted },
        originalList: [
          ...stateTestData.originalList.filter(x => x.id !== 6)          
        ],
        displayList: [
          ...stateTestData.originalList.filter(x => x.id !== 6)    
        ],
        paging: {
          ...stateTestData.paging,
          totalCount: 5,
          activePage: 1
        }
      };

      const actualState = todoStateReducer(state, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case added and stay on active page', () => {
      const state = { 
        ...stateTestData,
        paging: {
          ...stateTestData.paging,
          activePage: 2
        }
      };
      const expectedTodo = {
        id: 7,
        title: "Task 7",
        description: "Description 7",
        completed: false,
        createdAt: new Date(2022, 1, 4)
      } as ITodo;
      const action = {
        type: TodoActions.added,
        payload: {
          title: 'Task 7', 
          description: 'Description 7',
          createdAt: new Date(2022, 1, 4)
        }
      } as IAction;
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.added },
        originalList: [
          ...stateTestData.originalList,
          expectedTodo     
        ],
        displayList: [
          ...stateTestData.originalList,
          expectedTodo
        ],
        paging: {
          ...stateTestData.paging,
          totalCount: 7,
          activePage: 2,
          startIndex: 5,
          endIndex: 10
        }
      };

      const actualState = todoStateReducer(state, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case added and add first item with id 1', () => {
      const state = new State([]);
      const expectedTodo = {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
        createdAt: new Date(2022, 1, 4)
      } as ITodo;
      const action = {
        type: TodoActions.added,
        payload: {
          title: 'Task 1', 
          description: 'Description 1',
          createdAt: new Date(2022, 1, 4)
        }
      } as IAction;
      const expectedState = {
        ...state,
        effectTrigger: { type: TodoActions.added },
        originalList: [
          expectedTodo     
        ],
        displayList: [
          expectedTodo
        ],
        paging: {
          ...state.paging,
          totalCount: 1,
          activePage: 1,
          startIndex: 0,
          endIndex: 5
        }
      };

      const actualState = todoStateReducer(state, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should throw error if action is archived', () => {
      const action = {
        type: 'archived',
        payload: { }
      } as IAction;

      expect(() => todoStateReducer(stateTestData, action)).toThrow('Unknown action: ' + action.type);

    });
  });
});