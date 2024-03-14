import renderer from 'react-test-renderer';
import { TodoStateProvider, TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { Search } from './Search';
import { fireEvent, render, screen } from '@testing-library/react';
import { IAction, TodoActions } from '../../models/Action';

describe('Search', () => {
  it('component should match snapshot', () => {
    const context = {
      state: stateTestData,
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should trigger search', () => {
    const context = {
      state: {
        ...stateTestData,
        search: { searchTerm: 'Task 1' }
      },
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    render(jsxElement);

    const action = {
      type: TodoActions.search,
      payload: {
        filter: context.state.filter, 
        sort: context.state.sort,
        searchTerm: 'Task 1'
      }
    } as IAction;

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);  

    expect(context.dispatch).toBeCalledWith(action);
  });

  it('should disabled search button', () => {
    const state = {
      ...stateTestData,
      search: { searchTerm: '' }
    };
    render(
      (<TodoStateProvider initialState={state}>
        <Search placeholder={"Please enter task name..."} />
      </TodoStateProvider>)
    );

    const searchButton = screen.getByTestId('search-button');

    expect(searchButton).toBeDisabled();
  });

  it('should not disable search button', () => {
    const state = {
      ...stateTestData,
      search: { searchTerm: 'Task 1' }
    };
    render(
      (<TodoStateProvider initialState={state}>
        <Search placeholder={"Please enter task name..."} />
      </TodoStateProvider>)
    );

    const searchButton = screen.getByTestId('search-button');

    expect(searchButton).toBeEnabled();
  });

  it('should update search input field', () => {
    const context = {
      state: stateTestData,
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    render(jsxElement);
    
    const action = {
      type: TodoActions.searchTermUpdated,
      payload: {
        searchTerm: 'Task 1'
      }
    } as IAction;

    const searchInput = screen.getByTestId('search-input');      
    fireEvent.change(searchInput, {target: {value: 'Task 1'}});

    expect(context.dispatch).toBeCalledWith(action);
  });

  it('should update search input field and trigger search', () => {
    const context = {
      state: {
        ...stateTestData,
        search: { searchTerm: 'Task 1' }
      },
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    render(jsxElement);

    const searchTermAction = {
      type: TodoActions.searchTermUpdated,
      payload: {
        searchTerm: ''
      }
    } as IAction;
    const searchAction = {
      type: TodoActions.search,
      payload: {
        filter: context.state.filter, 
        sort: context.state.sort,
        searchTerm: ''
      }
    } as IAction;

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeTruthy();
      
    fireEvent.change(searchInput, {target: {value: ''}});

    expect(context.dispatch).toBeCalledWith(searchTermAction);
    expect(context.dispatch).toBeCalledWith(searchAction);
  });

  it('should clear search input field and trigger search', () => {
    const context = {
      state: {
        ...stateTestData,
        search: { searchTerm: 'Task 1' }
      },
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    render(jsxElement);

    const action = {
      type: TodoActions.search,
      payload: {
        filter: context.state.filter, 
        sort: context.state.sort,
        searchTerm: ''
      }
    } as IAction;

    const clearSearchButton = screen.getByTestId('clear-search');      
    fireEvent.click(clearSearchButton);

    expect(context.dispatch).toBeCalledWith(action);
  });
});