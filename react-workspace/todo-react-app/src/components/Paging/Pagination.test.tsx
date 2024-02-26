import renderer from 'react-test-renderer';
import { CustomPagination } from './Pagination';
import { stateTestData } from '../../context/testData';
import { TodoStateProvider } from '../../context/TodoListContext';

describe('Pagination', () => {
  it('component should match snapshot', () => {
    const inputSelectRef = {
      current: {
        focus: jest.fn()
      }
    } as any;

    const jsxElement = 
    (<TodoStateProvider todoList={stateTestData}>
      <CustomPagination inputSelectRef={inputSelectRef} rotate={false} pageCount={5} maxVisiblePagesCount={3} />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});