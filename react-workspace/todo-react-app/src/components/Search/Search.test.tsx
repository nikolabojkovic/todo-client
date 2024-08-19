import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TodoStateProvider, TodosContext, TodosDispatchContext, stateTestData } from '../../context';
import { Search } from './Search';
import { IAction, TodoActions } from '../../models';
import { Settings } from '../TodoSettings';

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
        searchTerm: 'Task 1'
      }
    } as IAction;

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);  

    expect(context.dispatch).toBeCalledWith(action);
  });

  it('should trigger search on key press', async () => {
    const context = {
      state: {
        ...stateTestData,
        search: { searchTerm: '' },
        settings: { 
          ...stateTestData.settings,
          search: {
            ...stateTestData.settings.search,
            isSearchOnKeyPressEnabled: true
          }
        }
      },
      dispatch: jest.fn()
    };
    const jsxElement = 
    (<TodosContext.Provider value={context.state}>
       <TodosDispatchContext.Provider value={context.dispatch} >
         <Search placeholder={"Please enter task name..."} />
       </TodosDispatchContext.Provider>
     </TodosContext.Provider>);
    await act( async () => {
      render(jsxElement);
    });

    const action = {
      type: TodoActions.search,
      payload: {
        searchTerm: 'Task 1'
      }
    } as IAction;

    const searchInput = screen.getByTestId('search-input');      
    fireEvent.change(searchInput, {target: {value: 'Task 1'}});
 
    await waitFor(() => {
      expect(context.dispatch).toBeCalledWith(action);
    }); 
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
        searchTerm: ''
      }
    } as IAction;

    const clearSearchButton = screen.getByTestId('clear-search');      
    fireEvent.click(clearSearchButton);

    expect(context.dispatch).toBeCalledWith(action);
  });
});