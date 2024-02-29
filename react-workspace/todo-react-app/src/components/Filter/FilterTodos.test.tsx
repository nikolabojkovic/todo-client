import renderer, { act } from 'react-test-renderer';
import { FilterTodos } from './FilterTodos';
import { IFilter, StateFilter } from '../../models/IFilter';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';

describe('FilterTodos', () => {  
  const api = {
    getList: (): Observable<any> => { return of([])}
  }

  jest.doMock('../../providers/TodoProvider.ts', () => api.getList);
  //jest.spyOn(api, 'getList');

  it('component should render all option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} getList={api.getList} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should render completed option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.completed } as IFilter} getList={api.getList} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should render uncompleted option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.uncompleted } as IFilter} getList={api.getList} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should filter by all', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} getList={api.getList} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-all-option');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' All ');    
    //expect(api.getList).toHaveBeenCalled();
  });

  it('should filter by completed', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} getList={api.getList} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-completed-option');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Completed ');
    //expect(api.getList).toHaveBeenCalled();
  });

  it('should filter by uncompleted', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} getList={api.getList} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-uncompleted-option');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Uncompleted ');
    //expect(api.getList).toHaveBeenCalled();
  });
});