import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, waitFor, screen } from "@testing-library/react";

import { IState, TodosContext, TodosDispatchContext, stateTestData } from "../../../context";
import { GeneralSettings } from "./GeneralSettings";
import { IAction, IGeneralSettings, ISettings, ListContainerType, TodoActions } from '../../../models';
import userEvent from '@testing-library/user-event';

describe('GeneralSettings', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  
  it('match snapshot general settings', () => {
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
          <GeneralSettings></GeneralSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('match snapshot general settings list size type fixed', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Fixed
          } as IGeneralSettings
        } as ISettings
      } as IState
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <GeneralSettings></GeneralSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('actions', () => {
    it('should update settings on confirm on change/delete swich toggle', async () => {
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
            <GeneralSettings></GeneralSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      await act( async () => {
        render(jsxElement);
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            isConfirmEnabled: false
          }
        }
      } as IAction;
  
      const toggle = screen.getByTestId('comfirm-enabled');
      fireEvent.click(toggle);
   
      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(action);
      }); 
    });

    it('should update settings on confirm on pagination enabled swich toggle', async () => {
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
            <GeneralSettings></GeneralSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      await act( async () => {
        render(jsxElement);
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            isPaginationEnabled: false
          }
        }
      } as IAction;
  
      const toggle = screen.getByTestId('pagination-enabled');
      fireEvent.click(toggle);
   
      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(action);
      }); 
    });

    it('should update settings on confirm on infinite scroll enabled swich toggle', async () => {
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
            <GeneralSettings></GeneralSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      await act( async () => {
        render(jsxElement);
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            isInfiniteScrollEnabled: true,
            isPaginationEnabled: false
          } as IGeneralSettings
        }
      } as IAction;
  
      const toggle = screen.getByTestId('infinite-scroll-enabled');
      fireEvent.click(toggle);
   
      await waitFor(() => {
        expect(context.dispatch).toBeCalledWith(action);
      }); 
    });

    it('should update settings on list size type fixed option selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              listSizeType: ListContainerType.Dynamic
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <GeneralSettings></GeneralSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const listSizeDropdown = screen.getByTestId('list-size-dropdown');
  
      await act(async () => {      
        return await userEvent.click(listSizeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            listSizeType: ListContainerType.Fixed
          } as IGeneralSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('list-size-option-fixed');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('should update settings on list size type dynamic option selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              listSizeType: ListContainerType.Fixed
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <GeneralSettings></GeneralSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const listSizeDropdown = screen.getByTestId('list-size-dropdown');
  
      await act(async () => {      
        return await userEvent.click(listSizeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            listSizeType: ListContainerType.Dynamic
          } as IGeneralSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('list-size-option-dynamic');
        
      fireEvent.click(dropdownOption);  
     
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('should update settings on list size input changed', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              listSizeType: ListContainerType.Fixed
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <GeneralSettings></GeneralSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          general: {
            ...context.state.settings.general,
            fixedListSize: 600
          } as IGeneralSettings
        }
      } as IAction;
        
      const listSizeInput = screen.getByTestId('list-size-input');
      fireEvent.change(listSizeInput, {target: {value: 600}});
     
      expect(context.dispatch).toBeCalledWith(action);
    });
  });
});