import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { TodoList } from '../../components/TodoList';
import { TodoListProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';

describe('todo list rendered', () => {
  it('match snapshot', () => {
    const todoListJsxElements = (<TodoListProvider todoList={stateTestData}>
                                   <TodoList/>
                                 </TodoListProvider>);
    const tree = renderer.create(
      todoListJsxElements
    ).toJSON();
    render(todoListJsxElements);
    expect(tree).toMatchSnapshot();
  });
});
