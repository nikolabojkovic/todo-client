import renderer from 'react-test-renderer';
import { Footer } from './Footer';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';

describe('Paging', () => {
  it('component should match snapshot', () => {
    const jsxElement = 
    (<TodoStateProvider todoList={stateTestData}>
      <Footer />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });
});