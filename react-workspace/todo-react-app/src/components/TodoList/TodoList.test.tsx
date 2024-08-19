import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { DisplayMode, IState, TodosContext, TodosDispatchContext, stateTestData } from '../../context';
import { IAction, IGeneralSettings, IPaginationSettings, IPaging, ISettings, TodoActions } from '../../models';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

const dnd = jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: any) => children({
    draggableProps: {
      key:{},
      draggableId:{},
      index:{},
      style: {},
    },
    innerRef: jest.fn(),
  } as unknown as DraggableProvided, 
  {} as DraggableStateSnapshot),
  Draggable:
    ({ children }: any) => children({
      draggableProps: {
        style: {},
      },
      innerRef: jest.fn(),
    }, 
    {
      isDragging: true,  
    } as DraggableStateSnapshot),
  DragDropContext: ({ children }: any) => children,
}));

describe('todo list rendered', () => {  
  const globalContext = {
    state: {
      ...stateTestData,
    },
    dispatch: jest.fn()
  };

  describe('dragging enabled', () => {
    it('match snapshot list with dragging enabled and active', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false 
        }
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });

    it('on drag and drop outside of drop area action should be canceled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: false
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
            <div data-testid='wrong-drop-zone'></div>
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
  
      render(jsxElement);

      const dragElement = screen.getByTestId("draggable-item-0");
      const dropZone = screen.getByTestId("wrong-drop-zone");
  
      fireEvent.dragStart(dragElement);
      fireEvent.dragEnter(dropZone);
      fireEvent.drop(dropZone);
      fireEvent.dragLeave(dropZone);
      fireEvent.dragEnd(dragElement);
      
      const elementId = 1;
      const elementArrayIndex = 1;
      const elements = globalContext.state.displayList.filter(x => x.id !== elementId);
      const draggedAndDroppedElement = globalContext.state.displayList.find(x => x.id === elementId)!;
      const action = {
        type: TodoActions.manuallySorted,
        payload: {
          list: [...elements.slice(0, elementArrayIndex), draggedAndDroppedElement, ...elements.slice(elementArrayIndex)]
        }   
      } as IAction;
  
      // Activates drag and drop
      dnd.mock.call('DropableContext', 'react-beautiful-dnd');
      expect(context.dispatch).not.toBeCalledWith(action);
    });

    it('on drag and drop of the selected item from the list should drag and drop selected item in a different position when pagination disabled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: false
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
  
      render(jsxElement);
  
      const SPACE = { keyCode: 32 };
      const ARROW_DOWN = { keyCode: 40 };
      const element = screen.getByTestId('draggable-item-0');
      element.focus();
  
      fireEvent.keyDown(element, SPACE); // Begins the dnd
      fireEvent.keyDown(element, ARROW_DOWN); // Moves the element
      fireEvent.keyDown(element, SPACE); // Ends the dnd
      
      const elementId = 1;
      const elementArrayIndex = 1;
      const elements = globalContext.state.displayList.filter(x => x.id !== elementId);
      const draggedAndDroppedElement = globalContext.state.displayList.find(x => x.id === elementId)!;
      const action = {
        type: TodoActions.manuallySorted,
        payload: {
          list: [...elements.slice(0, elementArrayIndex), draggedAndDroppedElement, ...elements.slice(elementArrayIndex)]
        }   
      } as IAction;
  
      // Activates drag and drop
      dnd.mock.call('DropableContext', 'react-beautiful-dnd');
      expect(context.dispatch).toBeCalledWith(action);
    });

    it('on drag and drop of the selected item from the list should drag and drop selected item in a different position on the second page when pagination enabled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          paging: {
            ...globalContext.state.paging,
            activePage: 2,
            itemsPerPage: 3,
            startIndex: 3,
            endIndex: 5
          } as IPaging,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: true
            } as IGeneralSettings
          } as ISettings
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
  
      render(jsxElement);
  
      const SPACE = { keyCode: 32 };
      const ARROW_DOWN = { keyCode: 40 };
      const element = screen.getByTestId('draggable-item-0');
      element.focus();
  
      fireEvent.keyDown(element, SPACE); // Begins the dnd
      fireEvent.keyDown(element, ARROW_DOWN); // Moves the element
      fireEvent.keyDown(element, SPACE); // Ends the dnd

      const elementId = 4;
      const elementArrayIndex = 4;
      const elements = globalContext.state.displayList.filter(x => x.id !== elementId);
      const draggedAndDroppedElement = globalContext.state.displayList.find(x => x.id === elementId)!;
      const action = {
        type: TodoActions.manuallySorted,
        payload: {
          list: [...elements.slice(0, elementArrayIndex), draggedAndDroppedElement, ...elements.slice(elementArrayIndex)]
        }   
      } as IAction;
  
      // Activates drag and drop
      dnd.mock.call('DropableContext', 'react-beautiful-dnd');
      expect(context.dispatch).toBeCalledWith(action);
    });
  });

  describe('dragging disabled', () => {
    it('match snapshot list with dragging disabled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          displayMode: DisplayMode.Filtered
        }
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });
  
    it('match snapshot list with pagination disabled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: false
            }
          }
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });
  
    it('match snapshot list with infinite scroll enabled', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: false,
          settings: {
            ...globalContext.state.settings,
            general: {
              ...globalContext.state.settings.general,
              isPaginationEnabled: false,
              isInfiniteScrollEnabled: true
            }
          }
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });
  
    it('match snapshot list with no data', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          originalList: [],
          displayList: [],
          paging: {
            ...globalContext.state.paging,
            totalCount: 0,
          },
          isLoading: false,
        } as IState
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });
  
    it('match snapshot loader', () => {
      const context = {
        ...globalContext,
        state: { 
          ...globalContext.state,
          isLoading: true 
        }
      };
      const jsxElement = 
        (<TodosContext.Provider value={context.state}>
           <TodosDispatchContext.Provider value={context.dispatch} >
            <TodoList />
           </TodosDispatchContext.Provider>
         </TodosContext.Provider>);
      const tree = renderer.create(
        jsxElement
      ).toJSON();
      render(jsxElement);
      expect(tree).toMatchSnapshot();
    });
  });
});
