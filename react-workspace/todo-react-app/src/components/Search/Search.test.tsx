import renderer from 'react-test-renderer';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { Search } from './Search';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Search', () => {
  const handleSearch = jest.fn();
  it('component should match snapshot', () => {    
    const jsxElement = 
    (<TodoStateProvider initialState={stateTestData}>
      <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should trigger search', () => {
    render(
      (<TodoStateProvider initialState={stateTestData}>
        <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const searchInput = screen.getByTestId('search-input');
    const searchButton = screen.getByTestId('search-button');
      
    fireEvent.change(searchInput, {target: {value: 'Task 1'}});
    fireEvent.click(searchButton);  

    expect(handleSearch).toBeCalled();
  });

  it('should disabled search button', () => {
    render(
      (<TodoStateProvider initialState={stateTestData}>
        <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const searchButton = screen.getByTestId('search-button');

    expect(searchButton).toBeDisabled();
  });

  it('should not disable search button', () => {
    const state = {
      ...stateTestData,
      search: { searchTerm: 'Task 1' }
    }
    render(
      (<TodoStateProvider initialState={state}>
        <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const searchButton = screen.getByTestId('search-button');

    expect(searchButton).toBeEnabled();
  });

  it('should update search input field', () => {
    render(
      (<TodoStateProvider initialState={stateTestData}>
        <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const searchInput = screen.getByTestId('search-input');      
    fireEvent.change(searchInput, {target: {value: 'Task 1'}});

    expect(handleSearch).not.toBeCalled();
  });

  it('should update search input field and trigger search', () => {
    const state = {
      ...stateTestData,
      search: { searchTerm: 'Task 1' }
    }
    render(
      (<TodoStateProvider initialState={state}>
        <Search placeholder={"Please enter task name..."} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeTruthy();
      
    fireEvent.change(searchInput, {target: {value: ''}});

    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('should clear search input field and trigger search', () => {
    const state = {
      ...stateTestData,
      search: { searchTerm: 'Task 1' }
    }
    render(
      (<TodoStateProvider initialState={state}>
        <Search placeholder={'Please enter task name...'} onSearch={handleSearch} />
      </TodoStateProvider>)
    );

    const clearSearchButton = screen.getByTestId('clear-search');      
    fireEvent.click(clearSearchButton);

    expect(handleSearch).toHaveBeenCalledWith('');
  });
});