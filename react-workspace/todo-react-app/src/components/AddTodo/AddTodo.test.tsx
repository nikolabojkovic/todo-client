import renderer from 'react-test-renderer';
import { AddTodo } from './AddTodo';
import { fireEvent, render, screen } from '@testing-library/react';
import { TodoStateProvider, useTodoList } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';

describe('AddTodo', () => {
  let jsxElement = <AddTodo />;

  it('component should match snapshot', () => {
    const component = renderer.create(jsxElement);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('Fill out the form', () => {
    it('should disable add button if title is empty', () => {
      render(jsxElement);
      const titleInput = screen.getByTestId('title-input');
      const addTodoButton = screen.getByTestId('add-todo-button');
      fireEvent.change(titleInput, {target: {value: 'todo title'}});

      expect(addTodoButton).toBeDisabled();
    });

    it('should disable add button if description is empty', () => {
      render(jsxElement);
      const descriptionInput = screen.getByTestId('description-input');
      const addTodoButton = screen.getByTestId('add-todo-button');
      fireEvent.change(descriptionInput, {target: {value: 'todo description'}});

      expect(addTodoButton).toBeDisabled();
    });

    it('should enable add button if title and description are not empty', () => {
      render(jsxElement);
      const titleInput = screen.getByTestId('title-input')
      const descriptionInput = screen.getByTestId('description-input');
      const addTodoButton = screen.getByTestId('add-todo-button');
      fireEvent.change(titleInput, {target: {value: 'todo title'}});
      fireEvent.change(descriptionInput, {target: {value: 'todo description'}});

      expect(addTodoButton).not.toBeDisabled();
    });
  });

  describe('Click the Add button', () => {
    it('Should add new todo', () => {
      render(
        (<TodoStateProvider todoList={stateTestData}>
          <AddTodo />
        </TodoStateProvider>)
      );      
      const titleInput = screen.getByTestId('title-input')
      const descriptionInput = screen.getByTestId('description-input');
      const addTodoButton = screen.getByTestId('add-todo-button');
      fireEvent.change(titleInput, {target: {value: 'new title'}});
      fireEvent.change(descriptionInput, {target: {value: 'new description'}});
      fireEvent.click(addTodoButton);

      expect(addTodoButton).toBeDisabled();
    });
  });
});