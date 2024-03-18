import { useEffect } from 'react';
import { Observable, first } from 'rxjs';

import { ISort } from '../../models/ISort';
import { Loader } from '../Loader/Loader';

import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';
import { IStorageProvider } from '../../providers/StorageProvider';

import { GetListProps } from '../../providers/TodoProvider';
import { TodoItem } from '../TodoItem/TodoItem';
import { ITodo } from '../../models/Todo';
import { IAction, TodoActions } from '../../models/Action';

type Props = {
  getList: ({ storageProvider, filter, sort, searchTerm }: GetListProps) => Observable<ITodo[]>,
  saveList: (provider: IStorageProvider, list: ITodo[]) => Observable<unknown>
  storageProvider: IStorageProvider
};

export function TodoList({ getList, saveList, storageProvider }: Props) {
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
      getList({
        ...todoList.effectTrigger.payload,
        storageProvider,
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
              searchTerm: todoList.effectTrigger!.payload.searchTerm,
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
  }, [todoList.effectTrigger, dispatch, getList, storageProvider]);

  useEffect(() => {
    if (todoList.effectTrigger
      && (todoList.effectTrigger.type === TodoActions.added
       || todoList.effectTrigger.type === TodoActions.changed
       || todoList.effectTrigger.type === TodoActions.deleted
       || todoList.effectTrigger.type === TodoActions.imported)) {
       saveList(storageProvider, todoList.originalList).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList, saveList, storageProvider]);

  return (
    <main className="App__todo-list">
      {todoList.isLoading && 
        <Loader />
      }
      {!todoList.isLoading && 
      <section className=''>
        {
          (todoList.paging.totalCount > 0 ?
            todoList.displayList
                  .slice(todoList.paging.startIndex, todoList.paging.endIndex)
                  .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />) 
          : <div className='text-light mt-5 mb-5 fade-in'>No data</div>)
        }
      </section>
      }
    </main>
  );
}