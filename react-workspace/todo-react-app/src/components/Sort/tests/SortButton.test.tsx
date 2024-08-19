import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { SortButton } from '../SortButton';
import { SortDirection, SortType } from '../../../models';

describe('ImportExport', () => {
  const handleSort = jest.fn();
  it('component should match snapshot', () => {
    const jsxElement = <SortButton column={'title'} text={'Title'} disabled={false} active={false} sortType={SortType.direction} sortDirection={SortDirection.Desc} onClick={handleSort} />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('component should match snapshot sort direction none', () => {
    const jsxElement = 
      <SortButton 
        column={'sortId'} 
        text={'Manual order'} 
        disabled={false} 
        active={false} 
        sortType={SortType.noDirection} 
        sortDirection={SortDirection.None} 
        onClick={handleSort} 
      />;
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('button disabled click', () => {
    it('should not switch sort direction on click', () => {
      render(<SortButton column={'title'} text={'Title'} disabled={true} active={false} sortType={SortType.direction} sortDirection={SortDirection.Desc} onClick={handleSort} />);
      const sortButton = screen.getByTestId('title-sort-button-direction-desc');          
      fireEvent.click(sortButton); 
  
      expect(handleSort).not.toBeCalled();
    });
  });

  describe('button enabled click', () => {
    it('should switch sort direction from Desc to Asc', () => {
      render(<SortButton column={'title'} text={'Title'} disabled={false} active={false} sortType={SortType.direction} sortDirection={SortDirection.Desc} onClick={handleSort} />);
      const sortButton = screen.getByTestId('title-sort-button-direction-desc');          
      fireEvent.click(sortButton); 
  
      expect(handleSort).toBeCalledWith('title', SortDirection.Asc);
    });
  
    it('should switch sort direction from Asc to Desc', () => {
      render(<SortButton column={'title'} text={'Title'} disabled={false} active={false} sortType={SortType.direction} sortDirection={SortDirection.Asc} onClick={handleSort} />);
      const sortButton = screen.getByTestId('title-sort-button-direction-asc');          
      fireEvent.click(sortButton); 
  
      expect(handleSort).toBeCalledWith('title', SortDirection.Desc);
    });

    it('sort direction none should not swich sort direction', () => {
      render(
        <SortButton 
          column={'sortId'} 
          text={'Manual order'} 
          disabled={false} 
          active={false} 
          sortType={SortType.noDirection} 
          sortDirection={SortDirection.None} 
          onClick={handleSort} 
        />
      );
      const sortButton = screen.getByTestId('sortId-sort-button-direction-none');          
      fireEvent.click(sortButton); 
  
      expect(handleSort).toBeCalledWith('sortId', SortDirection.None);
    });
  });
});