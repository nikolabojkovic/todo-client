import renderer, { act } from 'react-test-renderer';
import { PageSize } from './PageSize';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PageSize', () => {
  const inputSelectRef = {
    current: {
      focus: jest.fn()
    }
  };

  it('component should match snapshot page size 10', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={0} pageSize={10} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display default page size', () => {
    const jsxElement =
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={0} />
      </TodoStateProvider>);
    const tree = renderer.create(jsxElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should select page size 5', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={50} pageSize={10} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-5');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(selectedFilterOption.textContent).toBe(' 5 ');
  });

  it('should select page size 10', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={50} pageSize={5} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-10');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(selectedFilterOption.textContent).toBe(' 10 ');
  });

  it('should select page size 50', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={50} pageSize={5} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-50');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(selectedFilterOption.textContent).toBe(' 50 ');
  });

  it('should select page size 100', async () => {
    render(
      (<TodoStateProvider todoList={stateTestData}>
        <PageSize inputSelectRef={inputSelectRef} pageCount={50} pageSize={5} />
      </TodoStateProvider>)
    ); 
    let selectedFilterOption = screen.getByTestId('selected-size-option');

    await act(async () => {      
      return await userEvent.click(selectedFilterOption);    
    });

    const filterDropdown = screen.getByTestId('size-option-100');
      
    fireEvent.click(filterDropdown);  
    selectedFilterOption = screen.getByTestId('selected-size-option');

    expect(selectedFilterOption.textContent).toBe(' 100 ');
  });
});