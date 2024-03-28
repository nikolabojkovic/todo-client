import renderer from 'react-test-renderer';
import { TodosContext, TodosDispatchContext } from "../../../context/TodoListContext";
import { stateTestData } from "../../../context/testData";
import { PaginationSettings } from "./PaginationSettings";
import { render } from '@testing-library/react';

describe('', () => {
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
});