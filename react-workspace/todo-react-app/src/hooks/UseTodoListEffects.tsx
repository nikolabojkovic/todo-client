import { useEffect } from "react";
import { first, firstValueFrom } from "rxjs";

import { useTodoList, useTodoListDispatch } from "../context";
import { IAction, ISort, TodoActions } from "../models";
import providers, { GetListProps, sortingLocalStorageKey } from "../providers";

export function useTodoListEffect() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  useEffect(() => {   
    if (!todoList.effectTrigger) {
      return;
    }   

    if (todoList.effectTrigger.type === TodoActions.fetch
      || todoList.effectTrigger.type === TodoActions.filter
      || todoList.effectTrigger.type === TodoActions.search
      || todoList.effectTrigger.type === TodoActions.sort) {
      dispatch({
        type: TodoActions.loadingStarted
      } as IAction);
    }

    if (todoList.effectTrigger.type === TodoActions.fetch) {
      fetchData();
    }

    if (todoList.effectTrigger.type === TodoActions.filter) {
      filterData();
    }

    if (todoList.effectTrigger.type === TodoActions.search) {
      searchData();
    }

    if (todoList.effectTrigger.type === TodoActions.sort) {
      sortData();
    }

     if (todoList.effectTrigger.type === TodoActions.manuallySorted
       || todoList.effectTrigger.type === TodoActions.sorted) {
        providers.storageProvider.setItem(sortingLocalStorageKey, todoList.sort).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger]); 

  useEffect(() => {
    if (todoList.effectTrigger
      && (todoList.effectTrigger.type === TodoActions.added
       || todoList.effectTrigger.type === TodoActions.changed
       || todoList.effectTrigger.type === TodoActions.deleted
       || todoList.effectTrigger.type === TodoActions.imported
       || todoList.effectTrigger.type === TodoActions.manuallySorted
       || todoList.effectTrigger.type === TodoActions.restoredAll
       || todoList.effectTrigger.type === TodoActions.deletedAll
      )) {
        providers.todoListProvider.saveList(todoList.originalList).pipe(first()).subscribe();
     }
  }, [todoList.effectTrigger, todoList.originalList]);

  async function fetchData() {
    let sort = todoList.effectTrigger?.payload.sort;
    const localStorageSort = await firstValueFrom(providers.storageProvider.getItem(sortingLocalStorageKey));

    if (localStorageSort) {
      sort = JSON.parse(localStorageSort) as ISort;
    }

    const todoListData = await firstValueFrom(providers.todoListProvider.getList({
      filter: todoList.filter,
      searchTerm: todoList.search.searchTerm,
      sort 
    } as GetListProps));

    dispatch({
      type: TodoActions.fetched,
      payload: {
        sort,
        list: todoListData
      }
    } as IAction);
  }

  async function filterData() {
    const todoListData = await firstValueFrom(providers.todoListProvider.getList({
      filter: todoList.effectTrigger?.payload.filter,
      searchTerm: todoList.search.searchTerm,
      sort: todoList.sort
    } as GetListProps));

    dispatch({
      type: TodoActions.filtered,
      payload: {
        activePage: 1,
        list: todoListData,
        filter: todoList.effectTrigger!.payload.filter
      }
    } as IAction);
  }

  async function searchData() {
    const todoListData = await firstValueFrom(providers.todoListProvider.getList({
      filter: todoList.filter,
      searchTerm: todoList.effectTrigger?.payload.searchTerm,
      sort: todoList.sort
    } as GetListProps));
    
    dispatch({
      type: TodoActions.searched,
      payload: {
        list: todoListData,
        activePage: 1,
      }
    } as IAction);
  }

  async function sortData() {
    const todoListData = await firstValueFrom(providers.todoListProvider.getList({
      filter: todoList.filter,
      searchTerm: todoList.search.searchTerm,
      sort: todoList.effectTrigger?.payload.sort 
    } as GetListProps));
    dispatch({
      type: TodoActions.sorted,
      payload: {
        sort: todoList.effectTrigger!.payload.sort,
        list: todoListData
      }
    } as IAction);
  }
}