import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { TodoList } from '../../components/TodoList';
import { TodoListProvider } from '../../context/TodoListContext';
import { inMemoryTodoListTestData } from '../../context/testData';

describe('todo list rendered', () => {
  it('match snapshot', () => {
    const todoListJsxElements = (<TodoListProvider todoList={inMemoryTodoListTestData}>
                                   <TodoList/>
                                 </TodoListProvider>);
    const tree = renderer.create(
      todoListJsxElements
    ).toJSON();
    render(todoListJsxElements);
    expect(tree).toMatchSnapshot();
  });
});
