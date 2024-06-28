import { todosReducer } from './todo.reducer';
import { IState, State } from './state';
import { Todo } from '../models/todo';
import { todos } from '../../tests/test-data';
import { TodoListActions } from './todo.actions';
import { IFilter, StateFilter } from '../models/filter';
import { IPaging } from '../models/paging';
import { ISort, SortDirection } from '../models';

describe('todosReducer', () => {
  describe('fetched action', () => {
    it('should retrieve all todos and update the state in immutable way', () => {
      const initialState = {...new State(todos)} as IState;
      const newTodoList = [new Todo(1, 'Task 1', 'Description 1', false, new Date(2022, 1, 4), 1)] as Todo[];
      const newState = {
        ...initialState,
        isLoading: false,
        originalList: newTodoList,
        displayList: newTodoList,
        paging: {
          ...initialState.paging,
          totalCount: newTodoList.length,
          activePage: 1,
          itemsPerPage: initialState.paging.itemsPerPage,
          startIndex: 0,
          endIndex: initialState.paging.itemsPerPage
        } as IPaging,
      } as IState;
      const action = TodoListActions.fetched({
        list: newTodoList,
        sort: {
          column: 'id',
          direction: SortDirection.Asc
        } as ISort
      });
      const state = todosReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toEqual(initialState);
    });
  });

  describe('added action', () => {
    it('should add one todo and go to the next page', () => {
      const initialState = {...new State(todos)} as IState;
      const newTodoList = [...todos, new Todo(7, 'Task 7', 'Description 7', false, new Date(2022, 1, 4), 1)] as Todo[];
      const newState = {...new State(newTodoList)} as IState;
      const action = TodoListActions.added({ title: 'Task 7', description: 'Description 7' });
      const state = todosReducer(initialState, action);

      expect(state.originalList.length).toBe(newState.originalList.length);
      expect(state.originalList.length).not.toBe(initialState.originalList.length);
      expect(state.originalList[6].id).toBe(7);
      expect(state.paging.activePage).toBe(2);
    });

    it('should add one todo and stay on the active page', () => {
      const initialState = {...new State(todos)} as IState;
      initialState.paging.activePage = 2;
      const newTodoList = [...todos, new Todo(7, 'Task 7', 'Description 7', false, new Date(2022, 1, 4), 1)] as Todo[];
      const newState = {...new State(newTodoList)} as IState;
      const action = TodoListActions.added({ title: 'Task 7', description: 'Description 7' });
      const state = todosReducer(initialState, action);

      expect(state.originalList.length).toBe(newState.originalList.length);
      expect(state.originalList.length).not.toBe(initialState.originalList.length);
      expect(state.originalList[6].id).toBe(7);
      expect(state.paging.activePage).toBe(2);
    });
  });

  describe('completed action', () => {
    it('should complete one todo in original and display list', () => {
      const initialState = {...new State(todos)} as IState;
      const action = TodoListActions.completed({ todoId: 1 });
      const state = todosReducer(initialState, action);

      expect(state.originalList[0].completed).toBeTrue();
      expect(todos).not.toEqual(state.displayList);
    });

    it('should not complete any todo in original and display list because todo does not exist', () => {
      const initialState = {...new State(todos)} as IState;
      const action = TodoListActions.completed({ todoId: 8 });
      const state = todosReducer(initialState, action);

      expect(todos).toEqual(state.displayList);
    });
  });

  describe('removed action', () => {
    it('should remove one todo in the original and the display list', () => {
      const initialState = {...new State(todos)} as IState;
      const action = TodoListActions.removed({ todoId: 1 });
      const state = todosReducer(initialState, action);

      expect(state.originalList.length).toBe(5);
      expect(state.displayList.length).toBe(5);
      expect(todos).not.toEqual(state.displayList);
    });

    it('should remove one todo in the original and the display list and update the active page', () => {
      const initialState = {...new State(todos)} as IState;
      initialState.paging.activePage = 2;
      const action = TodoListActions.removed({ todoId: 5 });
      const state = todosReducer(initialState, action);

      expect(state.displayList.length).toBe(5);
      expect(state.paging.activePage).toBe(1);
      expect(initialState.paging.activePage).toBe(2);
    });
  });

  describe('filtered action', () => {
    it('should filter todos in the display list', () => {
      const initialState = {...new State(todos)} as IState;
      const newState = {...new State(todos.filter(x => x.completed === true))} as IState;
      const action = TodoListActions.filtered({ activePage: 1, filter: { state: StateFilter.completed } as IFilter, list: newState.originalList });
      const state = todosReducer(initialState, action);

      expect(state.originalList.length).toBe(6);
      expect(state.displayList.length).toBe(1);
      expect(todos).not.toEqual(state.displayList);
      expect(todos).toEqual(state.originalList);
    });
  });
});
