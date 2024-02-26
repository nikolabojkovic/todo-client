import renderer from 'react-test-renderer';
import { FilterTodos } from './FilterTodos';
import { IFilter, StateFilter } from '../../models/IFilter';

describe('FilterTodos', () => {  
  it('component should match snapshot', () => {
    const jsxElement = <FilterTodos filter={{ state: StateFilter.all } as IFilter} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });
});