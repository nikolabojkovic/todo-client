import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TodosContext, TodosDispatchContext, stateTestData } from "../../context";
import { InfiniteScroll } from './InfiniteScroll';
import { IGeneralSettings, ISettings, ListContainerType } from '../../models';
import { of, Subject } from 'rxjs';

describe('InfiniteScroll', () => {
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };
  
  it('match snapshot infinite scroll fixed list size', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Fixed
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
          <InfiniteScroll 
            updateEndIndex={updateEndIndex} 
            fetch={new Subject<number>()} 
            itemHeight={55}
          >
            <div id="todo-list-content">
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
              <div>Item 5</div>
              <div>Item 6</div>
              <div>Item 7</div>
              <div>Item 8</div>
              <div>Item 9</div>
              <div>Item 10</div>
            </div>
          </InfiniteScroll>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('match snapshot infinite scroll dynamic list size', () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Dynamic
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <InfiniteScroll 
              updateEndIndex={updateEndIndex} 
              fetch={new Subject<number>()} 
              itemHeight={55}
            >
            <div id="todo-list-content">
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
              <div>Item 5</div>
              <div>Item 6</div>
              <div>Item 7</div>
              <div>Item 8</div>
              <div>Item 9</div>
              <div>Item 10</div>
            </div>
          </InfiniteScroll>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    const tree = renderer.create(
      jsxElement
    ).toJSON();
    render(jsxElement);
    expect(tree).toMatchSnapshot();
  });

  it('should scroll to bottom on fixed list', async () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Fixed
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <section className="App__todo-list">
                <InfiniteScroll 
                  updateEndIndex={updateEndIndex} 
                  fetch={new Subject<number>()} 
                  itemHeight={55}
                >
                  <div data-testid="todo-list-content">
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                    <div>Item 4</div>
                    <div>Item 5</div>
                    <div>Item 6</div>
                    <div>Item 7</div>
                    <div>Item 8</div>
                    <div>Item 9</div>
                    <div>Item 10</div>
                  </div>   
                </InfiniteScroll>    
            </section>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    render(jsxElement);

    const todoList = screen.getByTestId("scrollable-container");
    fireEvent.scroll(todoList, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(updateEndIndex).toBeCalled();
    }); 
  });

  it('scroll should trigger fetch items', async () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Fixed
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const fetch = new Subject<number>();
    jest.spyOn(fetch, 'next').mockImplementation();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <section className="App__todo-list">
                <InfiniteScroll 
                  updateEndIndex={updateEndIndex} 
                  fetch={fetch} 
                  itemHeight={55}
                >
                  <div data-testid="todo-list-content">
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                    <div>Item 4</div>
                    <div>Item 5</div>
                    <div>Item 6</div>
                    <div>Item 7</div>
                    <div>Item 8</div>
                    <div>Item 9</div>
                    <div>Item 10</div>
                  </div>   
                </InfiniteScroll>
            </section>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    await act( async () => {
      render(jsxElement);
    });

    const todoList = screen.getByTestId("scrollable-container");
    fireEvent.scroll(todoList, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(fetch.next).toBeCalledWith(8.636363636363637);
      expect(fetch.next).toBeCalledTimes(1);
    }); 
  });

  it('scroll should not trigger fetch items', async () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Dynamic
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const fetch = new Subject<number>();
    jest.spyOn(fetch, 'next').mockImplementation();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <section className="App__todo-list">
                <InfiniteScroll 
                  updateEndIndex={updateEndIndex} 
                  fetch={fetch} 
                  itemHeight={55}
                >
                  <div data-testid="todo-list-content">
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                    <div>Item 4</div>
                    <div>Item 5</div>
                    <div>Item 6</div>
                    <div>Item 7</div>
                    <div>Item 8</div>
                    <div>Item 9</div>
                    <div>Item 10</div>
                  </div>   
                </InfiniteScroll>
            </section>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    await act( async () => {
      render(jsxElement);
    });

    const todoList = screen.getByTestId("scrollable-container");
    fireEvent.scroll(todoList, { target: { scrollY: 1000 } });

    expect(fetch.next).not.toBeCalledWith(8.636363636363637);
  });

  it('shold not invoke infinite scroll if loading is in progress', async () => {
    const context = {
      ...globalContext,
      state: { 
        ...globalContext.state,
        isLoading: false,
        settings: {
          ...globalContext.state.settings,
          general: {
            ...globalContext.state.settings.general,
            listSizeType: ListContainerType.Fixed,
            // fixedListSize: 1000
          } as IGeneralSettings
        } as ISettings
      }
    };
    const updateEndIndex = jest.fn();
    const jsxElement = 
      (<TodosContext.Provider value={context.state}>
         <TodosDispatchContext.Provider value={context.dispatch} >
            <section className="App__todo-list">
                <InfiniteScroll 
                  updateEndIndex={updateEndIndex} 
                  fetch={new Subject<number>()} 
                  itemHeight={55}
                >
                  <div data-testid="todo-list-content">
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                    <div>Item 4</div>
                    <div>Item 5</div>
                    <div>Item 6</div>
                    <div>Item 7</div>
                    <div>Item 8</div>
                    <div>Item 9</div>
                    <div>Item 10</div>
                  </div>   
                </InfiniteScroll>    
            </section>
         </TodosDispatchContext.Provider>
       </TodosContext.Provider>);
    render(jsxElement);

    const todoList = screen.getByTestId("scrollable-container");
    fireEvent.scroll(todoList, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(updateEndIndex).toBeCalled();
    }); 
    fireEvent.scroll(todoList, { target: { scrollY: 1000 } });
  });
});