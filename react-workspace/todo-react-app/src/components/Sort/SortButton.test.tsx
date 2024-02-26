import renderer from 'react-test-renderer';
import { SortButton } from './SortButton';
import { SortDirection } from '../../models/ISort';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement = <SortButton column={'title'} text={'Title'} disabled={false} sortDirection={SortDirection.Desc} onClick={jest.fn()} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});