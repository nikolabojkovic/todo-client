import renderer from 'react-test-renderer';
import { Loader } from './Loader';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement = <Loader />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});