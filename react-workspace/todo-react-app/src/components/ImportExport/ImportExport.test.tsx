import renderer from 'react-test-renderer';
import { ImportExport } from './ImportExport';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement = <ImportExport />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});