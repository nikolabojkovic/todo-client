import { useEffect } from "react";
import { EMPTY, first, switchMap } from "rxjs";

import { IState } from "../context";
import { GetListProps, ITodoListProvider, LocalStorageProvider } from "../providers";
import { IAction, ISort, ITodo, TodoActions } from "../models";

const storageProvider = new LocalStorageProvider();
const sortingLocalStorageKey = 'todo-sort';

export function useTodoListEffect(todoList: IState, todoListProvider: ITodoListProvider, dispatch: any) {

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
    if (todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.fetch) {
      let sort = todoList.effectTrigger?.payload.sort;
      storageProvider.getItem(sortingLocalStorageKey).pipe(
        first(),
        switchMap((localStorageSort: string | null) => {
          if (localStorageSort) {
            sort = JSON.parse(localStorageSort) as ISort;
          }

          return todoListProvider.getList({
            filter: todoList.filter,
            searchTerm: todoList.search.searchTerm,
            sort 
          } as GetListProps).pipe(first());
        })
      )
      .subscribe((list: ITodo[]) => {
        dispatch({
          type: TodoActions.fetched,
          payload: {
            sort,
            list: list
          }
        } as IAction);
      });
    }
  }, [todoList.effectTrigger, dispatch, todoListProvider]);

  useEffect(() => {  
    if (todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.filter) {
      todoListProvider.getList({
        filter: todoList.effectTrigger.payload.filter,
        searchTerm: todoList.search.searchTerm,
        sort: todoList.sort
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {
        dispatch({
          type: TodoActions.filtered,
          payload: {
            activePage: 1,
            list: list,
            filter: todoList.effectTrigger!.payload.filter
          }
        } as IAction);
      });
    }
  }, [todoList.effectTrigger, dispatch, todoListProvider]);

  useEffect(() => {  
    if (todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.search) {
      todoListProvider.getList({
        filter: todoList.filter,
        searchTerm: todoList.effectTrigger.payload.searchTerm ,
        sort: todoList.sort
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {
        dispatch({
          type: TodoActions.searched,
          payload: {
            list: list,
            activePage: 1,
          }
        } as IAction);
      });
    }
  }, [todoList.effectTrigger, dispatch, todoListProvider]);

  useEffect(() => {  
    if (todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.sort) {
      todoListProvider.getList({
        filter: todoList.filter,
        searchTerm: todoList.search.searchTerm,
        sort: todoList.effectTrigger.payload.sort 
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {
          dispatch({
            type: TodoActions.sorted,
            payload: {
              sort: todoList.effectTrigger!.payload.sort,
              list: list
            }
          } as IAction);
      });
    }
  }, [todoList.effectTrigger, dispatch, todoListProvider]);
  

  useEffect(() => {  
    if (todoList.effectTrigger
     && (todoList.effectTrigger.type === TodoActions.fetch
      || todoList.effectTrigger.type === TodoActions.filter
      || todoList.effectTrigger.type === TodoActions.search
      || todoList.effectTrigger.type === TodoActions.sort)) {
      dispatch({
        type: TodoActions.loadingStarted
      } as IAction);
    }
  }, [todoList.effectTrigger, dispatch]);

  useEffect(() => {
    if (todoList.effectTrigger
      && (todoList.effectTrigger.type === TodoActions.added
       || todoList.effectTrigger.type === TodoActions.changed
       || todoList.effectTrigger.type === TodoActions.deleted
       || todoList.effectTrigger.type === TodoActions.imported
       || todoList.effectTrigger.type === TodoActions.manuallySorted)) {
      todoListProvider.saveList(todoList.originalList).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList, todoListProvider]);

  useEffect(() => {
    if (todoList.effectTrigger 
      && (todoList.effectTrigger.type === TodoActions.manuallySorted
       || todoList.effectTrigger.type === TodoActions.sorted)) {
      storageProvider.setItem(sortingLocalStorageKey, todoList.sort).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList, todoListProvider]);
}