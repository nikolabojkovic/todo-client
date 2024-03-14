import { IAction, TodoActions } from "../models/Action";
import { IFilter, StateFilter } from "../models/IFilter";
import { IPaging } from "../models/IPaging";
import { ISort, SortDirection } from "../models/ISort";
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
      } as IAction
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.filter, payload: action.payload }
      }

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
      } as IAction
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.search, payload: action.payload }
      }

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });

    it('should execute case fetched', () => {
      const action = {
        type: TodoActions.fetched,
        payload: {
          list: stateTestData.originalList
        }
      } as IAction
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
      } as IAction
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
      }

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
      } as IAction
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
      }

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
          list: [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)],
        }
      } as IAction
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        isLoading: false,
        displayList: [...stateTestData.originalList.sort((a: any, b: any) => a.title > b.title ? 1 : -1)],
        sort: {
          column: 'title', 
          direction: SortDirection.Asc
        } as ISort,
      }

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
      } as IAction
      const expectedState = {
        ...stateTestData,
        effectTrigger: { type: TodoActions.imported },
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
      }

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
      } as IAction
      const expectedState = {
        ...stateTestData,
        effectTrigger: null,
        search: { searchTerm: 'Task 1' },
      }

      const actualState = todoStateReducer(stateTestData, action);

      expect(actualState).toEqual(expectedState);
    });
  });
});