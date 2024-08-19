import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { TodoItem } from './TodoItem';
import { TodosContext, TodosDispatchContext, stateTestData } from '../../context';
import { IAction, TodoActions } from '../../models';

describe('todo item', () => {
  const todo = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: false,
    createdAt: new Date(2023, 4, 5),
    sortId: 1
  };
  const todoCompleted = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: true,
    createdAt: new Date(2023, 4, 5),
    sortId: 1
  };

  describe('todo item uncompleted', () => {
    it('should match snapshot', () => {
      const tree = renderer.create(
        <TodoItem todo={todo} />
      ).toJSON();
      render(<TodoItem todo={todo} />);
      expect(tree).toMatchSnapshot();
    });
  
    it('should render 2 icons', () => {
      render(<TodoItem todo={todo} />);
      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBe(2);
    });
  });
  
  describe('todo item completed', () => {  
    it('should match snapshot', () => {
      const tree = renderer.create(
        <TodoItem todo={todoCompleted} />
      ).toJSON();
      render(<TodoItem todo={todoCompleted} />);
      expect(tree).toMatchSnapshot();
    });
  
    it('should render completed todo styled title', () => {    
      render(<TodoItem todo={todoCompleted} />);
      const titleElement = screen.getByText(todoCompleted.title);
      expect(titleElement).toHaveClass('App__todo-list__item-title--completed');
    });
  });
  
  describe('todo item behavours', () => {
    describe('actions with confirmation', () => {
      it('complete action should complete todo', () =>{
        const context = {
          state: {
            ...stateTestData,
          },
          dispatch: jest.fn()
        };
        const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoItem todo={todo} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.changed,
          payload: {
            todo: {...todo, completed: true}
          }
        } as IAction;
    
        const completeButton = screen.getByTestId('complete-button');      
        fireEvent.click(completeButton);
  
        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);
    
        expect(context.dispatch).toBeCalledWith(action);
      });
      it('complete action cancelled should not complete todo', () =>{
        const context = {
          state: {
            ...stateTestData,
          },
          dispatch: jest.fn()
        };
        const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoItem todo={todo} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.changed,
          payload: {
            todo: {...todo, completed: true}
          }
        } as IAction;
    
        const completeButton = screen.getByTestId('complete-button');      
        fireEvent.click(completeButton);
  
        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);
    
        expect(context.dispatch).not.toBeCalledWith(action);
      });
      it('on restore action should restore todo', () =>{
        const context = {
          state: {
            ...stateTestData,
          },
          dispatch: jest.fn()
        };
        const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoItem todo={todoCompleted} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.changed,
          payload: {
            todo: {...todo, completed: false}
          }
        } as IAction;
    
        const restoreButton = screen.getByTestId('restore-button');      
        fireEvent.click(restoreButton);
    
        expect(screen.queryByTestId('confirm-button')).toBeInTheDocument();
  
        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);
  
        expect(context.dispatch).toBeCalledWith(action);
      });
      it('delete action should delete todo', () =>{
        const context = {
          state: {
            ...stateTestData,
          },
          dispatch: jest.fn()
        };
        const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoItem todo={todo} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.deleted,
          payload: {
            id: todo.id
          }                
        } as IAction;
    
        const deleteButton = screen.getByTestId('delete-button');      
        fireEvent.click(deleteButton);
  
        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);
    
        expect(context.dispatch).toBeCalledWith(action);
      });
    });

    describe('actions without confirmation', () => {
      it('complete action should complete todo', () =>{
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
            <TodoItem todo={todo} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.changed,
          payload: {
            todo: {...todo, completed: true}
          }
        } as IAction;
    
        const completeButton = screen.getByTestId('complete-button');      
        fireEvent.click(completeButton);
    
        expect(context.dispatch).toBeCalledWith(action);
      });
      it('on restore action should restore todo', () =>{
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
            <TodoItem todo={todoCompleted} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.changed,
          payload: {
            todo: {...todo, completed: false}
          }
        } as IAction;
    
        const restoreButton = screen.getByTestId('restore-button');      
        fireEvent.click(restoreButton);
  
        expect(context.dispatch).toBeCalledWith(action);
      });
      it('delete action should delete todo', () =>{
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
            <TodoItem todo={todo} />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
        render(jsxElement);
    
        const action = {
          type: TodoActions.deleted,
          payload: {
            id: todo.id
          }                
        } as IAction;
    
        const deleteButton = screen.getByTestId('delete-button');      
        fireEvent.click(deleteButton);
    
        expect(context.dispatch).toBeCalledWith(action);
      });
    });
  });
});
