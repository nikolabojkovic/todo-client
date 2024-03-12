import renderer, { act } from 'react-test-renderer';
import { FilterTodos } from './FilterTodos';
import { IFilter, StateFilter } from '../../models/IFilter';
import { TodoStateProvider, TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IAction, TodoActions } from '../../models/Action';

describe('FilterTodos', () => {  
  it('component should render all option', () => {
    const jsxElement =
      (<TodoStateProvider initialState={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('component should render completed option', () => {
    const jsxElement =
      (<TodoStateProvider initialState={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.completed } as IFilter} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('component should render uncompleted option', () => {
    const jsxElement =
      (<TodoStateProvider initialState={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.uncompleted } as IFilter} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should filter by all', async () => {
    const context = {
      state: {
        ...stateTestData
      },
      dispatch: jest.fn()
    } as any;
    render(
      (
        <TodosContext.Provider value={context.state}>
          <TodosDispatchContext.Provider value={context.dispatch} >
            <FilterTodos filter={{ state: StateFilter.uncompleted } as IFilter} />
          </TodosDispatchContext.Provider>
        </TodosContext.Provider>
      )
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const action = {
      type: TodoActions.filter,
      payload: {
        filter: { 
          state: StateFilter.all
        } as IFilter, 
        sort: context.state.sort,
        searchTerm: context.state.search.searchTerm
      }
    } as IAction;
    const filterDropdown = screen.getByTestId('filter-option-all');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' All ');    
    expect(context.dispatch).toBeCalledWith(action);
  });

  it('should filter by completed', async () => {
    const context = {
      state: {
        ...stateTestData
      },
      dispatch: jest.fn()
    } as any;
    render(
      (
        <TodosContext.Provider value={context.state}>
          <TodosDispatchContext.Provider value={context.dispatch} >
            <FilterTodos filter={{ state: StateFilter.all } as IFilter} />
          </TodosDispatchContext.Provider>
        </TodosContext.Provider>
      )
    );

    const action = {
      type: TodoActions.filter,
      payload: {
        filter: { 
          state: StateFilter.completed
        } as IFilter, 
        sort: context.state.sort,
        searchTerm: context.state.search.searchTerm
      }
    } as IAction;
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-option-completed');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Completed ');
    expect(context.dispatch).toBeCalledWith(action);
  });

  it('should filter by uncompleted', async () => {
    const context = {
      state: {
        ...stateTestData
      },
      dispatch: jest.fn()
    } as any;
    render(
      (
        <TodosContext.Provider value={context.state}>
          <TodosDispatchContext.Provider value={context.dispatch} >
            <FilterTodos filter={{ state: StateFilter.all } as IFilter} />
          </TodosDispatchContext.Provider>
        </TodosContext.Provider>
      )
    );

    const action = {
      type: TodoActions.filter,
      payload: {
        filter: { 
          state: StateFilter.uncompleted
        } as IFilter, 
        sort: context.state.sort,
        searchTerm: context.state.search.searchTerm
      }
    } as IAction;
    
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-option-uncompleted');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Uncompleted ');
    expect(context.dispatch).toBeCalledWith(action);
  });
});