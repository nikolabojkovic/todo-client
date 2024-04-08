import renderer from 'react-test-renderer';
import { Paging } from './Paging';

import { TodoStateProvider, stateTestData } from '../../context';

describe('Paging', () => {
  it('component should match snapshot', () => {
    const jsxElement = 
    (<TodoStateProvider initialState={stateTestData}>
      <Paging />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();

    expect(tree).toMatchSnapshot();
  });
});