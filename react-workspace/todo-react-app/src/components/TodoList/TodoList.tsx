import { useEffect, useState } from 'react';
import { Subject, delay, first } from 'rxjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { ISort, ITodo, IAction, TodoActions, ListContainerType } from '../../models';
import { useTodoList, useTodoListDispatch } from '../../context';
import { ITodoListProvider } from '../../providers';
import { Loader, TodoItem } from '../';
import { useTodoListEffect } from '../../hooks/UseTodoListEffects';

type Props = {
  todoListProvider: ITodoListProvider
};

export function TodoList({ todoListProvider }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const todoItemheight = 55;

  const [infiniteScroll, setInfiniteScroll] = useState({ 
    startIndex: 0, 
    endIndex: calculateinfiniteScrollEndIndex(),
    isLoading: false,
    fetch: new Subject<number>()
  });

  useTodoListEffect(todoList, todoListProvider, dispatch);

  useEffect(() => { 
    dispatch({
      type: TodoActions.fetch,
      payload: {
        sort: {
          column: 'createdAt',
          direction: 'asc'
        } as ISort
      }
    } as IAction);
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    const subscription = infiniteScroll.fetch
      .pipe(
        delay(1000), // TODO: switchMap to http request which whill load data from BE
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

  function getDisplayList() {
    if (todoList.settings.general.isPaginationEnabled) {
      return todoList.displayList
        .slice(todoList.paging.startIndex, todoList.paging.endIndex)
        .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />);
    }

    if (todoList.settings.general.isInfiniteScrollEnabled) {
      return todoList.displayList
        .slice(infiniteScroll.startIndex, infiniteScroll.endIndex)
        .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />);
    }
      
    return todoList.displayList.map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />);
  }

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
     && infiniteScroll.endIndex < todoList.originalList.length) {
      setInfiniteScroll({...infiniteScroll, isLoading: true });
      infiniteScroll.fetch.next(infiniteScroll.endIndex);
    }    
  };

  return (
    <>
    { todoList.activeTab !== 'settings' && 
      <main 
        id="todo-list-container" 
        className="App__todo-list" 
        onScroll={handleScroll}     
        style={ 
          todoList.settings.general.listSizeType === ListContainerType.Fixed 
          ? { 
              height: todoList.settings.general.fixedListSize,
              overflow: 'overlay'
            } 
          : {}
          }
        >
        { 
          todoList.isLoading 
          ? <Loader height={280} />
          : <section 
              id="todo-list-section"
              className=''
            >
              {
                (todoList.paging.totalCount > 0 ?
                  getDisplayList() 
                : <div className='text-light mt-5 mb-5 fade-in'>No data</div>)
              }
              {
                todoList.settings.general.isInfiniteScrollEnabled &&
                infiniteScroll.isLoading &&
                <Loader height={150} />
              }              
            </section>
        }
        {
          todoList.settings.general.isInfiniteScrollEnabled &&
          !infiniteScroll.isLoading &&
          infiniteScroll.endIndex < todoList.originalList.length &&
          <div id="infinite-scroll-end" className="App__todo-list__infinite-scroll-end">
            <div className="App__todo-list__infinite-scroll-end--bouncing">
              <FontAwesomeIcon icon={faAngleDown} />
              <div>Scroll down to load more</div>
            </div>            
          </div>
        }      
      </main>
    }    
    </>
  );
}