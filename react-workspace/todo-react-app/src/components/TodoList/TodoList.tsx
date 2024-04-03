import { useEffect } from 'react';
import { first } from 'rxjs';

import { ISort } from '../../models/ISort';
import { Loader } from '../Loader/Loader';
import { ITodo } from '../../models/Todo';
import { IAction, TodoActions } from '../../models/Action';

import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';

import { GetListProps, ITodoListProvider } from '../../providers/TodoProvider';

import { TodoItem } from '../TodoItem/TodoItem';
import { ListContainerType } from '../../models/ISettings';

type Props = {
  todoListProvider: ITodoListProvider
};

export function TodoList({ todoListProvider }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

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
    if (todoList.effectTrigger
     && (todoList.effectTrigger.type === TodoActions.fetch
      || todoList.effectTrigger.type === TodoActions.filter
      || todoList.effectTrigger.type === TodoActions.search
      || todoList.effectTrigger.type === TodoActions.sort)) {
      dispatch({
        type: TodoActions.loadingStarted
      } as IAction);
      todoListProvider.getList({
        ...todoList.effectTrigger.payload,
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {
        if (todoList.effectTrigger!.type === TodoActions.fetch) {
          dispatch({
            type: TodoActions.fetched,
            payload: {
              list: list
            }
          } as IAction);
        }

        if (todoList.effectTrigger!.type === TodoActions.filter) {
          dispatch({
            type: TodoActions.filtered,
            payload: {
              activePage: 1,
              list: list,
              filter: todoList.effectTrigger!.payload.filter
            }
          } as IAction);
        }

        if (todoList.effectTrigger!.type === TodoActions.search) {
          dispatch({
            type: TodoActions.searched,
            payload: {
              list: list,
              activePage: 1,
            }
          } as IAction);
        }

        if (todoList.effectTrigger!.type === TodoActions.sort) {
          dispatch({
            type: TodoActions.sorted,
            payload: {
              sort: todoList.effectTrigger!.payload.sort,
              list: list
            }
          } as IAction);
        }
      });
    }
  }, [todoList.effectTrigger, dispatch, todoListProvider]);

  useEffect(() => {
    if (todoList.effectTrigger
      && (todoList.effectTrigger.type === TodoActions.added
       || todoList.effectTrigger.type === TodoActions.changed
       || todoList.effectTrigger.type === TodoActions.deleted
       || todoList.effectTrigger.type === TodoActions.imported)) {
      todoListProvider.saveList(todoList.originalList).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList, todoListProvider]);

  function getDisplayList() {
    if (todoList.settings.general.isPaginationEnabled) {
      return todoList.displayList
        .slice(todoList.paging.startIndex, todoList.paging.endIndex)
        .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />);
    }
      
    return todoList.displayList.map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />);
  }

  return (
    <>
    { todoList.activeTab !== 'settings' && 
      <main className="App__todo-list">
        { 
          todoList.isLoading 
          ? <Loader />
          : <section 
              className='' 
              style={ 
                todoList.settings.general.listSizeType === ListContainerType.Fixed 
                ? { 
                    height: todoList.settings.general.fixedListSize,
                    overflow: 'overlay'
                  } 
                : {}
                }>
              {
                (todoList.paging.totalCount > 0 ?
                  getDisplayList() 
                : <div className='text-light mt-5 mb-5 fade-in'>No data</div>)
              }
            </section>
        }
      </main>
    }
    </>
  );
}