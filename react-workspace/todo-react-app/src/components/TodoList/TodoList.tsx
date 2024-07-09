import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ITodo, IAction, TodoActions } from '../../models';
import { DisplayMode, useTodoList, useTodoListDispatch } from '../../context';
import { TodoItem, InfiniteScroll } from '../';
import { useState } from 'react';

export function TodoList() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [endIndex, setEndIndex] = useState(todoList.displayList.length);
  const isDraggingEnabled = todoList.displayList.length > 0 && todoList.displayMode === DisplayMode.All;

  let items : ITodo[] = [];
  if (todoList.settings.general.isPaginationEnabled) {
    items = todoList.displayList.slice(todoList.paging.startIndex, todoList.paging.endIndex);
  } else {
    items =  items = todoList.displayList.slice(0, endIndex);
  } 

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
    userSelect: "none",
  });

  function setScrollEndIndex(index: number) {
    setEndIndex(index);
  }

  const reorder = (list: Array<ITodo>, startIndex: number, endIndex: number) => {
    if (todoList.settings.general.isPaginationEnabled) {
      startIndex = startIndex + ((todoList.paging.activePage - 1) * todoList.paging.itemsPerPage);
      endIndex =  endIndex + ((todoList.paging.activePage - 1)  * todoList.paging.itemsPerPage);
    }
    
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      todoList.originalList,
      result.source.index,
      result.destination.index
    );

    items.forEach((item: ITodo, index: number) => item.sortId = index);

    dispatch({
      type: TodoActions.manuallySorted,
      payload: {
        list: items
      }      
    } as IAction);
  }

  const listContent = 
    (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided, snapshot) => (
            <div 
              id="todo-list-content"
              className= {isDraggingEnabled ? 'drag-list' : ''}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              { 
                items.map((item: ITodo, index: number) =>
                  <Draggable 
                    key={item.id} 
                    draggableId={`item-${item.id}`} 
                    index={index} 
                    isDragDisabled={todoList.displayMode === DisplayMode.Filtered}
                  >
                    {(provided, snapshot) => ( 
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className={snapshot.isDragging ? 'item-dragging' : ''}
                      >
                        <TodoItem 
                          key={item.id} 
                          todo={item}
                        /> 
                      </div>
                    )}
                  </Draggable>        
                )
              }                    
              {provided.placeholder}        
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

  if (todoList.paging.totalCount === 0) return (<div className='text-light mt-5 mb-5 fade-in'>No data</div>);

  return (
    <section 
      id="todo-list-container" 
      className="App__todo-list" 
      >
        { todoList.settings.general.isInfiniteScrollEnabled ?
          (<InfiniteScroll setEndIndex={setScrollEndIndex}>          
              { listContent }
          </InfiniteScroll>)
          : listContent 
        }       
    </section>
  );
}