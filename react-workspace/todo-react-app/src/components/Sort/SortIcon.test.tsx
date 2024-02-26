import renderer from 'react-test-renderer';
import { SortIcon } from './SortIcon';
import { SortDirection } from '../../models/ISort';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement = <SortIcon sortDirection={SortDirection.Asc} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});