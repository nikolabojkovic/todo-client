import renderer, { act } from 'react-test-renderer';
import { FilterTodos } from './FilterTodos';
import { IFilter, StateFilter } from '../../models/IFilter';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FilterTodos', () => {  
  const handleFilter = jest.fn();

  it('component should render all option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} onFilter={handleFilter} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should render completed option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.completed } as IFilter} onFilter={handleFilter}  />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should render uncompleted option', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.uncompleted } as IFilter} onFilter={handleFilter}  />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should filter by all', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.uncompleted } as IFilter} onFilter={handleFilter}  />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-option-all');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' All ');    
    expect(handleFilter).toHaveBeenCalledWith({ state: StateFilter.all } as IFilter);
  });

  it('should filter by completed', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} onFilter={handleFilter}  />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-option-completed');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Completed ');
    expect(handleFilter).toHaveBeenCalledWith({ state: StateFilter.completed } as IFilter);
  });

  it('should filter by uncompleted', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <FilterTodos filter={{ state: StateFilter.all } as IFilter} onFilter={handleFilter}  />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-filter-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('filter-option-uncompleted');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-filter-option');

    expect(selectedFilterOption.textContent).toBe(' Uncompleted ');
    expect(handleFilter).toHaveBeenCalledWith({ state: StateFilter.uncompleted } as IFilter);
  });
});