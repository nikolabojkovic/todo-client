import { useEffect } from "react";
import { first } from "rxjs";

import { IState } from "../context";
import { GetListProps, ITodoListProvider } from "../providers";
import { IAction, ITodo, TodoActions } from "../models";

export function useTodoListEffect(todoList: IState, todoListProvider: ITodoListProvider, dispatch: any) {

  useEffect(() => {  
    if (todoList.effectTrigger && todoList.effectTrigger.type === TodoActions.fetch) {
      todoListProvider.getList({
        filter: todoList.filter,
        searchTerm: todoList.search.searchTerm,
        sort: todoList.effectTrigger.payload.sort
      } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => {
        dispatch({
          type: TodoActions.fetched,
          payload: {
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
       || todoList.effectTrigger.type === TodoActions.imported)) {
      todoListProvider.saveList(todoList.originalList).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList, todoListProvider]);
}