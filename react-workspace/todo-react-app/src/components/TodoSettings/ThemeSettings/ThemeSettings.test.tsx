import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { TodosContext, TodosDispatchContext, stateTestData } from "../../../context";
import { ThemeSettings } from "./ThemeSettings";
import { BackgroundColor, BsThemes, IAction, IThemeSettings, TodoActions } from '../../../models';

describe('ThemeSettings', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('actions', () => {
    it('should switch background color to dark gray', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.DarkGray,
            bsTheme: BsThemes.Dark
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('dark-theme-gray-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch background color to dark blue', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.DarkBlue,
            bsTheme: BsThemes.Dark
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('dark-theme-blue-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch background color to dark red', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.DarkRed,
            bsTheme: BsThemes.Dark
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('dark-theme-red-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch background color to light gray', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.LightGray,
            bsTheme: BsThemes.Light
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('light-theme-gray-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch background color to light blue', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.LightBlue,
            bsTheme: BsThemes.Light
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('light-theme-blue-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch background color to light red', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...stateTestData.settings.theme,
            backgroundColor: BackgroundColor.LightRed,
            bsTheme: BsThemes.Light
          } as IThemeSettings
        }
      } as IAction;

      const backgroundButton = screen.getByTestId('light-theme-red-button');
      fireEvent.click(backgroundButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });

    it('should switch primary color to red', () => {
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
          <ThemeSettings></ThemeSettings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);  

      const action = {
        type: TodoActions.settingsUpdated,
        payload: {
          ...context.state.settings,
          theme: {
            ...context.state.settings.theme,
            primaryColor: '#FF0000',
            primaryColorTopCord: -35,
            primaryColorLefCord: 135
          } as IThemeSettings
        }
      } as IAction;

      const primaryColorButton = screen.getByTestId('primary-color-#FF0000-button');
      fireEvent.click(primaryColorButton);

      expect(globalContext.dispatch).toHaveBeenCalledWith(action);
    });
  });
});