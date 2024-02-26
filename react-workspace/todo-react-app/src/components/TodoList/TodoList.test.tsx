import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { TodoList } from './TodoList';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';

describe('todo list rendered', () => {
  it('match snapshot', () => {
    const todoListJsxElements = (<TodoStateProvider todoList={stateTestData}>
                                   <TodoList/>
                                 </TodoStateProvider>);
    const tree = renderer.create(
      todoListJsxElements
    ).toJSON();
    render(todoListJsxElements);
    expect(tree).toMatchSnapshot();
  });
});
