import renderer from 'react-test-renderer';
import { render } from "@testing-library/react";
import { TodosContext, TodosDispatchContext } from "../../../context/TodoListContext";
import { GeneralSettings } from "./GeneralSettings";
import { stateTestData } from '../../../context/testData';

describe('General settings', () => {
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
});