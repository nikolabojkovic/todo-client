import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ITodo, IAction, TodoActions } from '../../models';
import { DisplayMode, useTodoList, useTodoListDispatch } from '../../context';
import { TodoItem, InfiniteScroll } from '../';
import { useState } from 'react';
import { reorder } from '../../utils/reorder';
import { Subject } from 'rxjs';

export function TodoList() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [endIndex, setEndIndex] = useState(todoList.displayList.length);
  const [fetch, ] = useState(new Subject<number>());
  const isDraggingEnabled = todoList.displayList.length > 0 && todoList.displayMode === DisplayMode.All;
  
  if (todoList.paging.totalCount === 0) {
    return (<div className='text-light mt-5 mb-5 fade-in'>No data</div>);
  }

  let items : ITodo[] = [];
  if (todoList.settings.general.isPaginationEnabled) {
    items = todoList.displayList.slice(todoList.paging.startIndex, todoList.paging.endIndex);
  } else {
    items =  items = todoList.displayList.slice(0, endIndex);
  } 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let startIndex = result.source.index;
    let endIndex = result.destination.index;

    if (todoList.settings.general.isPaginationEnabled) {
      startIndex = startIndex + ((todoList.paging.activePage - 1) * todoList.paging.itemsPerPage);
      endIndex =  endIndex + ((todoList.paging.activePage - 1)  * todoList.paging.itemsPerPage);
    }

    const items = reorder(
      todoList.originalList,
      startIndex,
      endIndex
    );

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
          {(provided) => (
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
                        data-testid={todoList.displayMode === DisplayMode.All ? ('draggable-item-' + index) : ('non-draggable-item-' + index)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          userSelect: "none",
                        }}
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

  return (
    <section 
      className="App__todo-list" 
      >
        { todoList.settings.general.isInfiniteScrollEnabled ?
          (<InfiniteScroll updateEndIndex={(index: number) => setEndIndex(index)} fetch={fetch} itemHeight={55}>          
              { listContent }
          </InfiniteScroll>)
          : listContent 
        }       
    </section>
  );
}