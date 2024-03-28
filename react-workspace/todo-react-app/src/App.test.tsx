// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { TodosContext, TodosDispatchContext } from './context/TodoListContext';
import { stateTestData } from './context/testData';

test('renders todo list text', () => {
  const context = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  render(
    <TodosContext.Provider value={context.state}>
      <TodosDispatchContext.Provider value={context.dispatch} >
        <App />
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>);

  const linkElement = screen.getByText(/todo list/i);
  
  expect(linkElement).toBeInTheDocument();
});
