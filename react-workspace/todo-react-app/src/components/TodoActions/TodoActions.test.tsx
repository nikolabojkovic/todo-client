import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { TodosContext, TodosDispatchContext, stateTestData } from "../../context";
import { TodoActions } from "./TodoActions";
import { IAction, TodoActions as TodoStateActions } from '../../models';

describe('TodoActions', () => {
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
          <TodoActions></TodoActions>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  describe('action enabled', () => {
    it('on restore all action should restore all todos after action confirmed', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.restoredAll,
      } as IAction;
  
      const restoreAllButton = screen.getByTestId('restore-all-button');      
      fireEvent.click(restoreAllButton);
  
      expect(screen.queryByTestId('confirm-button')).toBeInTheDocument();
  
      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });
  
    it('delete all action should delete all todos after action confirmed', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
         <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.deletedAll,
      } as IAction;
  
      const deleteAllButton = screen.getByTestId('delete-all-button');      
      fireEvent.click(deleteAllButton);
  
      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('on restore all action should restore all todos without confirmation', () =>{
      const context = {
        state: {
          ...stateTestData,
          settings: {
            ...stateTestData.settings,
            general: {
              ...stateTestData.settings.general,
              isConfirmEnabled: false
            } 
          }
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.restoredAll,
      } as IAction;
  
      const restoreAllButton = screen.getByTestId('restore-all-button');      
      fireEvent.click(restoreAllButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('delete all action should delete all todos without confirmation', () =>{
      const context = {
        state: {
          ...stateTestData,
          settings: {
            ...stateTestData.settings,
            general: {
              ...stateTestData.settings.general,
              isConfirmEnabled: false
            } 
          }
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
         <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.deletedAll,
      } as IAction;
  
      const deleteAllButton = screen.getByTestId('delete-all-button');      
      fireEvent.click(deleteAllButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('confirm canceled should abourt action', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.restoredAll,
      } as IAction;
  
      const restoreAllButton = screen.getByTestId('restore-all-button');      
      fireEvent.click(restoreAllButton);
  
      expect(screen.queryByTestId('confirm-button')).toBeInTheDocument();
  
      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);
  
      expect(context.dispatch).not.toBeCalledWith(action);
    });
  });

  describe('action disabled', () => {
    it('on restore all action should not restore all todos while data is loading', () =>{
      const context = {
        state: {
          ...stateTestData,
          isLoading: true
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.restoredAll,
      } as IAction;
  
      const restoreAllButton = screen.getByTestId('restore-all-button');      
      fireEvent.click(restoreAllButton);
  
      expect(context.dispatch).not.toBeCalledWith(action);
    });
    it('delete all action should not delete all todos while data is loading', () =>{
      const context = {
        state: {
          ...stateTestData,
          isLoading: true
        },
        dispatch: jest.fn()
      };
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
         <TodoActions />
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoStateActions.deletedAll,
      } as IAction;
  
      const deleteAllButton = screen.getByTestId('delete-all-button');      
      fireEvent.click(deleteAllButton);
  
      expect(context.dispatch).not.toBeCalledWith(action);
    });
  });
});