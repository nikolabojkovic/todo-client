import renderer from 'react-test-renderer';
import { PageSize } from './PageSize';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';

describe('PageSize', () => {
  it('component should match snapshot', () => {
    const inputSelectRef = {
      current: {
        focus: jest.fn()
      }
    };

    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={0} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});