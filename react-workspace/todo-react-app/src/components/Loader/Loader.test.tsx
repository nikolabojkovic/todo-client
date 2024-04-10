import renderer from 'react-test-renderer';
import { Loader } from './Loader';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement = <Loader height={280} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});