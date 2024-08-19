import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { Pagination } from './Pagination';
import { TodoStateProvider, stateTestData } from '../../context';
import { MutableRefObject } from 'react';

describe('Pagination', () => {
  const inputSelectRef = {
    current: {
      focus: jest.fn()
    }
  } as unknown as MutableRefObject<HTMLButtonElement | null>;

  it('component should match snapshot', () => {
    const jsxElement = 
    (<TodoStateProvider initialState={stateTestData}>
      <Pagination inputSelectRef={inputSelectRef} rotate={false} pageCount={5} maxVisiblePagesCount={3} />
    </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('rotate flag is enabled', () => {
    it('should not render group buttons if the first page is active', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 1}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
 
      expect(screen.queryByTestId(/next-group/i)).toBeFalsy();
      expect(screen.queryByTestId(/prev-group/i)).toBeFalsy();
    });

    it('should not render group buttons if the last page is active', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 5}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/next-group/i)).toBeFalsy();
      expect(screen.queryByTestId(/prev-group/i)).toBeFalsy();
    });

    it('should render only active page in paging section', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 2}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={1} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/page-1/i)).toBeFalsy();
      expect(screen.queryByTestId(/page-2/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-3/i)).toBeFalsy();
    });

    it('should render active page at the beginning of the paging section', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 1}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={1} maxVisiblePagesCount={2} />
        </TodoStateProvider>)
      ); 
      expect(screen.queryByTestId(/page-1/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-1/i)?.textContent).toBe('1(current)');
    });

    it('should render active page in the middle of the paging section', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 3}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/page-2/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-3/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-4/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-3/i)?.textContent).toBe('3(current)');
    });

    it('should render active page at the end of the paging section', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 5}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
      expect(screen.queryByTestId(/page-2/i)).toBeFalsy();
      expect(screen.queryByTestId(/page-3/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-4/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-5/i)).toBeTruthy();
      expect(screen.queryByTestId(/page-5/i)?.textContent).toBe('5(current)');
    });

    it('should render active page at the fist place in the paging section', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 6}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={true} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/page-1/i)).toBeTruthy();
    });
  });

  describe('rotate flag is disabled', () => {
    const rotate = false;

    it('should render only next group button if the fist page is active', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 1}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/next-group/i)).toBeTruthy();
      expect(screen.queryByTestId(/prev-group/i)).toBeFalsy();
    });
  
    it('should render only previous group button if the last page is active', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 5}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/prev-group/i)).toBeTruthy();
      expect(screen.queryByTestId(/next-group/i)).toBeFalsy();
    });

    it('no data should render active page 0', () => {
      const state = { 
        ...stateTestData, 
        paging: { ...stateTestData.paging, activePage: 0}
      };
      render(
        (<TodoStateProvider initialState={state}>
          <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
        </TodoStateProvider>)
      ); 
  
      expect(screen.queryByTestId(/prev-group/i)).toBeFalsy();
      expect(screen.queryByTestId(/next-group/i)).toBeTruthy();
    });

    describe('should change active page', () => {  
      it('click on the next page button should select page no 2', () => {
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const nextPageButton = screen.getByTestId('next-page');
          
        fireEvent.click(nextPageButton);  
        const activePage = screen.getByTestId('page-2');
    
        expect(activePage.textContent).toBe('2(current)');
        expect(inputSelectRef!.current!.focus).toBeCalled();
      });

      it('click on the next page button should select page no 2 and should not focus inputElement', () => {
        const nullAsInputSelectRef = null as unknown as  MutableRefObject<HTMLButtonElement | null>;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={nullAsInputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const nextPageButton = screen.getByTestId('next-page');
          
        fireEvent.click(nextPageButton);  
        const activePage = screen.getByTestId('page-2');
    
        expect(activePage.textContent).toBe('2(current)');
      });
    
      it('click on the last page button should select page no 5', () => {
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const nextPageButton = screen.getByTestId('last-page');
          
        fireEvent.click(nextPageButton);  
        const activePage = screen.getByTestId('page-5');
    
        expect(activePage.textContent).toBe('5(current)');
      });
    
      it('click on the first page button should select page no 1', () => {
        stateTestData.paging.activePage = 2;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const firstPageButton = screen.getByTestId('first-page');      
        fireEvent.click(firstPageButton);  
        const activePage = screen.getByTestId('page-1');
    
        expect(activePage.textContent).toBe('1(current)');
      });

      it('click on the second page button should select page no 2', () => {
        stateTestData.paging.activePage = 1;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const firstPageButton = screen.getByTestId('page-2');      
        fireEvent.click(firstPageButton);  
        const activePage = screen.getByTestId('page-2');
    
        expect(activePage.textContent).toBe('2(current)');
      });
    
      it('click on the previous page button should select page no 2', () => {
        stateTestData.paging.activePage = 3;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const firstPageButton = screen.getByTestId('prev-page');      
        fireEvent.click(firstPageButton);  
        const activePage = screen.getByTestId('page-2');
    
        expect(activePage.textContent).toBe('2(current)');
      });
    
      it('click on the next group button should select page no 4', () => {
        stateTestData.paging.activePage = 1;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const nextGroupButton = screen.getByTestId('next-group');      
        fireEvent.click(nextGroupButton);  
        const activePage = screen.getByTestId('page-4');
    
        expect(activePage.textContent).toBe('4(current)');
      });
    
      it('click on the previous group button should select page no 5', () => {
        stateTestData.paging.activePage = 5;
        render(
          (<TodoStateProvider initialState={stateTestData}>
            <Pagination inputSelectRef={inputSelectRef} rotate={rotate} pageCount={5} maxVisiblePagesCount={3} />
          </TodoStateProvider>)
        ); 
        const prevGroupButton = screen.getByTestId('prev-group');      
        fireEvent.click(prevGroupButton);  
        const activePage = screen.getByTestId('page-3');
    
        expect(activePage.textContent).toBe('3(current)');
      });
    });
  });  
});