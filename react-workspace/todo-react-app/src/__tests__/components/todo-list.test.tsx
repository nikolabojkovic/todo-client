import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { TodoList } from '../../components/TodoList';
import { TodoListProvider } from '../../context/TodosContext';
import { TodoService } from '../../services/TodoService';

const todoService = new TodoService();

describe('todo list rendered', () => {
  it('match snapshot', () => {
    const todoList = todoService.getTodoList();
    const todoListJsxElements = (<TodoListProvider todoList={todoList}>
                                   <TodoList/>
                                 </TodoListProvider>);
    const tree = renderer.create(
      todoListJsxElements
    ).toJSON();
    render(todoListJsxElements);
    expect(tree).toMatchSnapshot();
  });
});
