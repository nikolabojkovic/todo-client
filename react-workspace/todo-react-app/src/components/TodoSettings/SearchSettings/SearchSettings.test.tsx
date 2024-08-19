import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { IState, TodosContext, TodosDispatchContext, stateTestData } from "../../../context";
import { SearchSettings } from "./SearchSettings";
import { IAction, ISearchSettings, ISettings, TodoActions } from '../../../models';

describe('SearchSettings', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  
  it('match snapshot search settings', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false 
      }
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <SearchSettings></SearchSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('match snapshot search on key press settings', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false, 
        settings: {
          ...globalContext.state.settings,
          search: {
            ...globalContext.state.settings.search,
            isSearchOnKeyPressEnabled: true
          } as ISearchSettings
        } as ISettings
      } as IState
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <SearchSettings></SearchSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('actions', () => {
    it('should update settings on search on key press enabled swich toggle', async () => {
      const context = {
        state: {
          ...stateTestData,
          search: { searchTerm: '' },
          settings: { 
            ...stateTestData.settings,
            search: {
              ...stateTestData.settings.search,
              isSearchOnKeyPressEnabled: false
            }
          }
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <SearchSettings></SearchSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      await act( async () => {
        render(jsxElement);
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          search: {
            ...stateTestData.settings.search,
            isSearchOnKeyPressEnabled: true
          } as ISearchSettings
        }
      } as IAction;
  
      const toggle = screen.getByTestId('search-on-keypress-switch');
      fireEvent.click(toggle);
   
      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(action);
      }); 
    });
    it('should update settings on list size input changed', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            search: {
              ...stateTestData.settings.search,
              isSearchOnKeyPressEnabled: true
            }
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <SearchSettings></SearchSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          search: {
            ...context.state.settings.search,
            debounceTime: 600
          } as ISearchSettings
        }
      } as IAction;
        
      const listSizeInput = screen.getByTestId('debounce-time-input');
      fireEvent.change(listSizeInput, {target: {value: 600}});
     
      expect(context.dispatch).toBeCalledWith(action);
    });
  });
});