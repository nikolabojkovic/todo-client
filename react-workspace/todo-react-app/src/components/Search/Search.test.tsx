import renderer from 'react-test-renderer';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { Search } from './Search';

describe('Search', () => {
  it('component should match snapshot', () => {
    const jsxElement = 
    (<TodoStateProvider todoList={stateTestData}>
      <Search placeholder={"Please enter task name..."} />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });
});