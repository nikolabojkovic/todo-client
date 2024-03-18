import { map } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { IFilter, StateFilter } from "../models/IFilter";
import { ISort, SortDirection } from "../models/ISort";
import { ITodo } from "../models/Todo";
import { IStorageProvider } from "./StorageProvider";

export type GetListProps = {
  storageProvider: IStorageProvider,
  filter: IFilter | null,
  sort: ISort | null,
  searchTerm: string | null,
}

const todoListName = 'todo-list';

export function getList ({storageProvider, filter, sort, searchTerm}: GetListProps): Observable<ITodo[]> {
  return storageProvider.getItem(todoListName).pipe(map((todoListData) => {
    if (todoListData === ''
      ||todoListData === undefined 
      || todoListData === null) {
       return [] as ITodo[];
     }
     
     let todos = JSON.parse(todoListData) as ITodo[];
 
     if (filter) {
       todos = filterList(todos, filter);
     }
 
     if (searchTerm) {
       todos = searchList(todos, searchTerm);
     }
 
     if (sort) {
       todos = sortList(todos, sort);
     }
 
     return todos;
  }));
}

export function saveList(storageProvider: IStorageProvider, list: ITodo[]): Observable<unknown> {
  return storageProvider.setItem(todoListName, list);
}

function searchList(list: ITodo[], searchTerm: string): ITodo[] {
  return list.filter((todo: ITodo) => {
    const title = todo.title.trim()
                            .toLocaleLowerCase()
                            .includes(searchTerm.trim()
                            .toLocaleLowerCase());

    const description = todo.description.trim()
                                        .toLocaleLowerCase()
                                        .includes(searchTerm.trim()
                                        .toLocaleLowerCase());

    return title || description;
  });
}

function filterList(list: ITodo[], filter: IFilter) : ITodo[] {
  if (filter.state === StateFilter.completed) {
    return list.filter((todo: ITodo) => todo.completed === true);
  }

  if (filter.state === StateFilter.uncompleted) {
    return list.filter((todo: ITodo) => todo.completed === false);
  }

  return [...list];
}

function sortList(list: ITodo[], sort: ISort) : ITodo[] {
  let sortResult = [];
  
  if (sort.column === 'createdAt') {
    if (sort.direction === SortDirection.Asc) {
      sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)];
    } else {
      sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)];
    }

    return sortResult;
  }

  if (sort.direction === SortDirection.Asc) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sortResult = [...list.sort((a: any, b: any) => a[sort.column] > b[sort.column] ? 1 : -1)];
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sortResult = [...list.sort((a: any, b: any) => a[sort.column] < b[sort.column] ? 1 : -1)];
  }

  return sortResult;
}