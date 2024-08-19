import { render, waitFor } from "@testing-library/react";
import renderer, { act } from 'react-test-renderer';

import { IState, TodosContext, TodosDispatchContext, stateTestData } from "../../context";
import { Settings } from "./TodoSettings";
import { TodoActions } from "../../models";
import providers from "../../providers";
import { of } from "rxjs";

describe('TodoSettings', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  
  it('match snapshot todo settings', () => {
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
          <Settings></Settings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('should dave todo settings', async () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        effectTrigger: { type: TodoActions.settingsUpdated }
      } as IState
    };
    jest.spyOn(providers.settingsProvider, 'saveSettings').mockImplementation(() => {
      return of({});
    });
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <Settings></Settings>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    
    await act( async () => {
      render(jsxElement);
    });

    await waitFor(() => {
      expect(providers.settingsProvider.saveSettings).toBeCalledWith(context.state.settings);
    });
  });
});