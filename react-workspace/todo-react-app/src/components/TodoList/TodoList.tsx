
import { TodoItem } from '../TodoItem/TodoItem';
import { Paging } from '../Paging/Paging';
import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';
import { ITodo } from '../../models/Todo';
import { GetListProps, TodoActions, getList, saveList } from '../../providers/TodoProvider';
import { first } from 'rxjs';
import { IAction } from '../../models/Action';
import { ISort } from '../../models/ISort';
import { Loader } from '../Loader/Loader';
import { useEffect } from 'react';
import { localStorageProvider } from '../../providers/StorageProvider';

export function TodoList() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  useEffect(() => {   
    dispatch({
      type: 'loading-started'
    } as IAction);

    getList({
        provider: localStorageProvider,
        sort: {
          column: 'createdAt',
          direction: 'asc'
        } as ISort
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {    
        dispatch({
          type: 'fetched',
          payload: {
            list: list
          }
        } as IAction);
      });
  }, [dispatch]);

  useEffect(() => {
    if (todoList.updateTriger
     && (todoList.updateTriger.type === TodoActions.added
      || todoList.updateTriger.type === TodoActions.changed
      || todoList.updateTriger.type === TodoActions.deleted
      || todoList.updateTriger.type === TodoActions.imported)) {
      saveList(localStorageProvider, todoList.originalList).pipe(first()).subscribe();
    }
  }, [todoList.updateTriger, todoList.originalList]);

  

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
      <Paging rotate={false} />
    </main>
  );
}