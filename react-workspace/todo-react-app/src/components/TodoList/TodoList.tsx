import { useEffect, useState } from 'react';
import { Subject, delay } from 'rxjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ITodo, IAction, TodoActions, ListContainerType } from '../../models';
import { DisplayMode, useTodoList, useTodoListDispatch } from '../../context';
import { LoadMore, Loader, TodoItem } from '../';

export function TodoList() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const todoItemheight = 55;
  const isDraggingEnabled = todoList.displayList.length > 0 && todoList.displayMode === DisplayMode.All;
  
  const [infiniteScroll, setInfiniteScroll] = useState({ 
    startIndex: 0, 
    endIndex: calculateinfiniteScrollEndIndex(),
    isLoading: false,
    fetch: new Subject<number>()
  });
  const hasMoreItemsToLoad = todoList.settings.general.isInfiniteScrollEnabled 
    && !infiniteScroll.isLoading 
    && !todoList.isLoading 
    && infiniteScroll.endIndex < todoList.displayList.length;
  const loadingMore = todoList.settings.general.isInfiniteScrollEnabled && infiniteScroll.isLoading;

  let items : ITodo[] = [];
  if (todoList.settings.general.isPaginationEnabled) {
    items = todoList.displayList
      .slice(todoList.paging.startIndex, todoList.paging.endIndex);
  } else if (todoList.settings.general.isInfiniteScrollEnabled) {
    items = todoList.displayList
      .slice(infiniteScroll.startIndex, infiniteScroll.endIndex);
  } else {
    items = todoList.displayList;
  }  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    const subscription = infiniteScroll.fetch
      .pipe(
        delay(1000),
      )
      .subscribe((endIndex: number) => {
        setInfiniteScroll({...infiniteScroll, endIndex: endIndex + 5, isLoading: false});
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setInfiniteScroll({
      startIndex: 0, 
      endIndex: calculateinfiniteScrollEndIndex(),
      isLoading: false,
      fetch: infiniteScroll.fetch
    });
  }, [todoList.settings.general.listSizeType]);

  function calculateinfiniteScrollEndIndex(): number {
    return (todoList.settings.general.listSizeType === ListContainerType.Fixed  
      ? ((todoList.settings.general.fixedListSize) / todoItemheight)
      : (document.documentElement.clientHeight - 200) / todoItemheight);
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
    userSelect: "none",
  });

  const handleScroll = () => {
    if (!todoList.settings.general.isInfiniteScrollEnabled || infiniteScroll.isLoading) {
      return;
    }

    let { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (todoList.settings.general.listSizeType === ListContainerType.Fixed) {
      scrollTop = document.getElementById('todo-list-container')!.scrollTop;
      clientHeight = document.getElementById('todo-list-container')!.clientHeight;      
      scrollHeight = document.getElementById('todo-list-container')!.scrollHeight;
    }

    if ((scrollTop + clientHeight >= scrollHeight - 20) 
     && !infiniteScroll.isLoading 
     && hasMoreItemsToLoad) {
      setInfiniteScroll({...infiniteScroll, isLoading: true });
      infiniteScroll.fetch.next(infiniteScroll.endIndex);
    }    
  };

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

  function renderList(items: ITodo[]) {
    return items.map((item: ITodo, index: number) =>
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
    );
  }

  if (todoList.paging.totalCount === 0) return (<div className='text-light mt-5 mb-5 fade-in'>No data</div>);

  return (
    <section 
      id="todo-list-container" 
      className="App__todo-list" 
      onScroll={handleScroll}     
      style={ 
        todoList.settings.general.listSizeType === ListContainerType.Fixed 
        ? { 
            height: todoList.settings.general.fixedListSize,
            overflow: 'overlay'
          } : {}
        }
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-list">
            {(provided, snapshot) => (
            <div 
              id="todo-list-content"
              className= {isDraggingEnabled ? 'drag-list' : ''}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              { renderList(items) }
              { loadingMore &&
                <Loader height={150} />
              }      
              {provided.placeholder}        
            </div>
            )}
          </Droppable>
        </DragDropContext>
      { hasMoreItemsToLoad && 
        <LoadMore />
      }      
    </section>
  );
}