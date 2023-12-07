import renderer, { act } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { TodoStateProvider } from '../../context/TodoListContext';
import { stateTestData } from '../../context/testData';
import { Tabs } from '../../components/Tabs';
import userEvent from '@testing-library/user-event'

describe('todo tabs', () => {
  const todoTabsJsxElement = 
      (<TodoStateProvider todoList={stateTestData}>
        <Tabs/>
      </TodoStateProvider>);

  it('should match snapshot', () => {
    const tree = renderer.create(
      todoTabsJsxElement
    ).toJSON();
    render(todoTabsJsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('should create', () => {    
    render(<Tabs />);
    const el = screen.queryByTestId('tabs');
    expect(el).toBeTruthy();
  });

  it('should switch to search tab', async () => {       
    render(todoTabsJsxElement);
    await act(async () => {
      return await userEvent.click(screen.queryByTestId('search-todos')!);
    });

    const searchTodosTabContent = screen.queryByTestId('tab-content-search-todos');
    expect(searchTodosTabContent).toBeTruthy();
  });
});