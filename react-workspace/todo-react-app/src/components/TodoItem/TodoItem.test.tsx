import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { TodosContext, TodosDispatchContext } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { IAction, TodoActions } from '../../models/Action';

describe('todo item', () => {
  const todo = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: false,
    createdAt: new Date(2023, 4, 5)
  };
  const todoCompleted = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: true,
    createdAt: new Date(2023, 4, 5)
  };

  describe('todo item uncompleted', () => {
    it('should match snapshot', () => {
      const tree = renderer.create(
        <TodoItem todo={todo}/>
      ).toJSON();
      render(<TodoItem todo={todo}/>);
      expect(tree).toMatchSnapshot();
    });
  
    it('should render 2 icons', () => {
      render(<TodoItem todo={todo}/>);
      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBe(2);
    });
  })
  
  describe('todo item completed', () => {  
    it('should match snapshot', () => {
      const tree = renderer.create(
        <TodoItem todo={todoCompleted}/>
      ).toJSON();
      render(<TodoItem todo={todoCompleted}/>);
      expect(tree).toMatchSnapshot();
    });
  
    it('should render completed todo styled title', () => {    
      render(<TodoItem todo={todoCompleted}/>);
      const titleElement = screen.getByText(todoCompleted.title);
      expect(titleElement).toHaveClass('App__todo-list__item-title--completed');
    });
  });
  
  describe('todo item behavours', () => {
    it('complete action should complete todo', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      } as any;
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoItem todo={todo}/>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoActions.changed,
        payload: {
          todo: {...todo, completed: true}
        }
      } as IAction;
  
      const clearSearchButton = screen.getByTestId('complete-button');      
      fireEvent.click(clearSearchButton);

      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('on complete action canceled should not complete todo', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      } as any;
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoItem todo={todo}/>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoActions.changed,
        payload: {
          todo: {...todo, completed: true}
        }
      } as IAction;
  
      const clearSearchButton = screen.getByTestId('complete-button');      
      fireEvent.click(clearSearchButton);

      const confirmButton = screen.getByTestId('cancel-button');
      fireEvent.click(confirmButton);
  
      expect(context.dispatch).not.toBeCalledWith(action);
    });

    it('on complete action should not complete already completed todo', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      } as any;
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoItem todo={todoCompleted}/>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoActions.changed,
        payload: {
          todo: {...todo, completed: true}
        }
      } as IAction;
  
      const clearSearchButton = screen.getByTestId('complete-button');      
      fireEvent.click(clearSearchButton);
  
      expect(screen.queryByTestId('confirm-button')).not.toBeInTheDocument();
      expect(context.dispatch).not.toBeCalledWith(action);
    });

    it('delete action should delete todo', () =>{
      const context = {
        state: {
          ...stateTestData,
        },
        dispatch: jest.fn()
      } as any;
      const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <TodoItem todo={todo}/>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
      render(jsxElement);
  
      const action = {
        type: TodoActions.deleted,
        payload: {
          id: todo.id
        }                
      } as IAction;
  
      const clearSearchButton = screen.getByTestId('delete-button');      
      fireEvent.click(clearSearchButton);

      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);
  
      expect(context.dispatch).toBeCalledWith(action);
    });
  });
});
