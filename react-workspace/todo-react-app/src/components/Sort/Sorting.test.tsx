import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { Sorting } from './Sorting';
import { TodoStateProvider, stateTestData } from '../../context';

describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement=
    (<TodoStateProvider initialState={stateTestData}>
      <Sorting />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should change active column from createdAt to title column', () => {
    render((<TodoStateProvider initialState={stateTestData}>
              <Sorting />
            </TodoStateProvider>)
    );

    const sortButton = screen.getByTestId('title-sort-button-direction-none');          
    fireEvent.click(sortButton); 

    expect(screen.queryByTestId(/createdAt-sort-button-direction-none/i)).toBeTruthy();
    expect(screen.queryByTestId(/title-sort-button-direction-asc/i)).toBeTruthy();
    expect(screen.queryByTestId(/description-sort-button-direction-none/i)).toBeTruthy();
    expect(screen.queryByTestId(/completed-sort-button-direction-none/i)).toBeTruthy();
  });

  it('should not change active column', () => {
    render((<TodoStateProvider initialState={stateTestData}>
              <Sorting />
            </TodoStateProvider>)
    );

    const sortButton = screen.getByTestId('createdAt-sort-button-direction-asc');          
    fireEvent.click(sortButton); 

    expect(screen.queryByTestId(/createdAt-sort-button-direction-desc/i)).toBeTruthy();
    expect(screen.queryByTestId(/title-sort-button-direction-none/i)).toBeTruthy();
    expect(screen.queryByTestId(/description-sort-button-direction-none/i)).toBeTruthy();
    expect(screen.queryByTestId(/completed-sort-button-direction-none/i)).toBeTruthy();
  });
});