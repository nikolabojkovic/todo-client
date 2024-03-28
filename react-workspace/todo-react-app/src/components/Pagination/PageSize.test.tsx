import renderer, { act } from 'react-test-renderer';
import { PageSize } from './PageSize';
import { TodoStateProvider, TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IAction, TodoActions } from '../../models/Action';

describe('PageSize', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  const inputSelectRef = {
    current: {
      focus: jest.fn()
    }
  } as unknown as React.RefObject<HTMLButtonElement> | ((instance: HTMLButtonElement | null) => void) | null | undefined;

  it('component should match snapshot page size 10', () => {
    const jsxElement =
      (<TodoStateProvider initialState={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={1} pageSize={10} totalCount={6} activePage={1} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display default page size', () => {
    const jsxElement =
      (<TodoStateProvider initialState={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={1} totalCount={6} activePage={1} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should select page size 5', async () => {
    render(
      <TodosContext.Provider value={globalContext.state}>
        <TodosDispatchContext.Provider value={globalContext.dispatch} >
          <PageSize inputSelectRef={inputSelectRef} pageCount={1} pageSize={10} totalCount={6} activePage={1} />
        </TodosDispatchContext.Provider>
      </TodosContext.Provider>);
    const actionPagingUpdated = {
      type: TodoActions.pagingUpdated,
      payload: {
        activePage: 1,
        itemsPerPage: 5
      }
    } as IAction;

    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-5');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(globalContext.dispatch).toBeCalledWith(actionPagingUpdated);
  });

  it('should select page size 10', async () => {
    render(
      <TodosContext.Provider value={globalContext.state}>
        <TodosDispatchContext.Provider value={globalContext.dispatch} >
          <PageSize inputSelectRef={inputSelectRef} pageCount={2} pageSize={5} totalCount={6} activePage={1} />
        </TodosDispatchContext.Provider>
      </TodosContext.Provider>);
    const actionPagingUpdated = {
      type: TodoActions.pagingUpdated,
      payload: {
        activePage: 1,
        itemsPerPage: 10
      }
    } as IAction;

    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-10');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(globalContext.dispatch).toBeCalledWith(actionPagingUpdated);
  });

  it('should select page size 50', async () => {
    render(
      <TodosContext.Provider value={globalContext.state}>
        <TodosDispatchContext.Provider value={globalContext.dispatch} >
          <PageSize inputSelectRef={inputSelectRef} pageCount={2} pageSize={5} totalCount={6} activePage={1} />
        </TodosDispatchContext.Provider>
      </TodosContext.Provider>);
    const actionPagingUpdated = {
      type: TodoActions.pagingUpdated,
      payload: {
        activePage: 1,
        itemsPerPage: 50
      }
    } as IAction;
    
    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-50');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(globalContext.dispatch).toBeCalledWith(actionPagingUpdated);
  });

  it('should select page size 100', async () => {
    render(
    <TodosContext.Provider value={globalContext.state}>
      <TodosDispatchContext.Provider value={globalContext.dispatch} >
        <PageSize inputSelectRef={inputSelectRef} pageCount={2} pageSize={5} totalCount={6} activePage={1} />
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>);
    const actionPagingUpdated = {
      type: TodoActions.pagingUpdated,
      payload: {
        activePage: 1,
        itemsPerPage: 100
      }
    } as IAction;

    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-100');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(globalContext.dispatch).toBeCalledWith(actionPagingUpdated);
  });
});