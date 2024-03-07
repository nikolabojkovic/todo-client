import renderer from 'react-test-renderer';
import { Sorting } from './Sorting';
import { stateTestData } from '../../context/testData';
import { TodoStateProvider } from '../../context/TodoListContext';
import { fireEvent, render, screen } from '@testing-library/react';

/* eslint-disable testing-library/prefer-presence-queries */
describe('ImportExport', () => {
  it('component should match snapshot', () => {
    const jsxElement=
    (<TodoStateProvider todoList={stateTestData}>
      <Sorting />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should change active column from createdAt to title column', () => {
    render((<TodoStateProvider todoList={stateTestData}>
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
    render((<TodoStateProvider todoList={stateTestData}>
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