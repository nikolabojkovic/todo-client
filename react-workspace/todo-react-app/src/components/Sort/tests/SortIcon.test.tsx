import renderer from 'react-test-renderer';

import { SortIcon } from '../SortIcon';
import { SortDirection } from '../../../models';

describe('ImportExport', () => {
  it('component should match snapshot for asc direction', () => {
    const jsxElement = <SortIcon sortDirection={SortDirection.Asc} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should match snapshot for desc direction', () => {
    const jsxElement = <SortIcon sortDirection={SortDirection.Desc} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});