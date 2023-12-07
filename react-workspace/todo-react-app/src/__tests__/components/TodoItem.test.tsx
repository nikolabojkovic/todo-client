import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { TodoItem } from '../../components/TodoItem';

describe('todo item uncompleted', () => {
  const todo = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: false,
    createdAt: new Date(2023, 4, 5)
  };

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
  const todoCompleted = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    completed: true,
    createdAt: new Date(2023, 4, 5)
  };

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