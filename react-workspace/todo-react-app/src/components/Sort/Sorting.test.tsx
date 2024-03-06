import renderer from 'react-test-renderer';
import { Sorting } from './Sorting';
import { stateTestData } from '../../context/testData';
import { TodoStateProvider } from '../../context/TodoListContext';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement=
    (<TodoStateProvider todoList={stateTestData}>
      <Sorting />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});