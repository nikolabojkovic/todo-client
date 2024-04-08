import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import { TodosContext, TodosDispatchContext, stateTestData } from "../../../context";
import { PaginationSettings } from "./PaginationSettings";

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
});