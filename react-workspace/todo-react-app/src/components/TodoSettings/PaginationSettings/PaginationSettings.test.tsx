import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, screen  } from '@testing-library/react';

import { IState, TodosContext, TodosDispatchContext, stateTestData } from "../../../context";
import { PaginationSettings } from "./PaginationSettings";
import { IAction, IGeneralSettings, IPaginationSettings, ISettings, PaginationType, TodoActions } from '../../../models';
import userEvent from '@testing-library/user-event';

describe('PaginationSettings', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  
  it('match snapshot pagination settings', () => {
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
          <PaginationSettings></PaginationSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('match snapshot pagination settings disabled', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            isPaginationEnabled: false
          } as IGeneralSettings
        } as ISettings
      } as IState
    };
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <PaginationSettings></PaginationSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('actions', () => {
    it('should update settings on pagination type classic option selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Rotate
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-pagination-type');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('pagination-type-option-classic');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
    it('should update settings on pagination type rotate option selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-pagination-type');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Rotate
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('pagination-type-option-rotate');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('should update settings on pagination visible pages option 1 selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic,
              maxVisiblePages: 3
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-visible-pages-number');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic,
            maxVisiblePages: 1
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('visible-pages-option-1');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
    it('should update settings on pagination visible pages option 2 selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic,
              maxVisiblePages: 3
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-visible-pages-number');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic,
            maxVisiblePages: 2
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('visible-pages-option-2');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
    it('should update settings on pagination visible pages option 3 selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic,
              maxVisiblePages: 5
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-visible-pages-number');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic,
            maxVisiblePages: 3
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('visible-pages-option-3');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
    it('should update settings on pagination visible pages option 4 selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic,
              maxVisiblePages: 3
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-visible-pages-number');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic,
            maxVisiblePages: 4
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('visible-pages-option-4');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
    it('should update settings on pagination visible pages option 5 selected', async () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings,
            pagination: {
              ...globalContext.state.settings.pagination,
              paginationType: PaginationType.Classic,
              maxVisiblePages: 3
            } as IPaginationSettings
          } as ISettings
        } as IState
      };
      render(
        (
          <TodosContext.Provider value={context.state}>
            <TodosDispatchContext.Provider value={context.dispatch} >
              <PaginationSettings></PaginationSettings>
            </TodosDispatchContext.Provider>
          </TodosContext.Provider>
        )
      ); 
      const paginationTypeDropdown = screen.getByTestId('dropdown-visible-pages-number');
  
      await act(async () => {      
        return await userEvent.click(paginationTypeDropdown);    
      });
  
      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          pagination: {
            ...context.state.settings.pagination,
            paginationType: PaginationType.Classic,
            maxVisiblePages: 5
          } as IPaginationSettings
        }
      } as IAction;
      const dropdownOption = screen.getByTestId('visible-pages-option-5');
        
      fireEvent.click(dropdownOption);  
   
      expect(context.dispatch).toBeCalledWith(action);
    });
   });
});