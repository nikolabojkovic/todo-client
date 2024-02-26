import renderer from 'react-test-renderer';
import { AddTodo } from './AddTodo';

describe('AddTodo', () => {
  it('component should match snapshot', () => {
    const jsxElement = <AddTodo />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});