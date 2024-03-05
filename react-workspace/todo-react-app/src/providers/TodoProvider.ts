import { map } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { IFilter, StateFilter } from "../models/IFilter";
import { ISort, SortDirection } from "../models/ISort";
import { ITodo } from "../models/Todo";
import { IStorageProvider } from "./StorageProvider";

export type GetListProps = {
  provider: IStorageProvider,
  filter: IFilter | null,
  sort: ISort | null,
  searchTerm: string | null,
}

const todoListName: string = 'todo-list';

export function getList ({provider, filter, sort, searchTerm}: GetListProps): Observable<ITodo[]> {
  return provider.getItem(todoListName).pipe(map((todoListData) => {
    if (todoListData === undefined 
      || todoListData === null) {
       return [] as ITodo[];
     }
     
     let todos = JSON.parse(todoListData ?? "[]") as ITodo[];
 
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
};

export function saveList(provider: IStorageProvider, list: ITodo[]): Observable<any> {
  return provider.setItem(todoListName, list);
}

function searchList(list: ITodo[], searchTerm: string): ITodo[] {
  let filteredList = list;

  if (searchTerm !== '') {
    filteredList = list.filter((todo: ITodo) => 
      todo.title.trim()
                .toLocaleLowerCase()
                .includes(searchTerm.trim()
                                    .toLocaleLowerCase()) 
   || todo.description.trim()
                      .toLocaleLowerCase()
                      .includes(searchTerm.trim()
                                          .toLocaleLowerCase()));
  }

  return filteredList;
}

function filterList(list: ITodo[], filter: IFilter) : ITodo[] {
  let filteredList = list;

  if (filter && filter.state === StateFilter.all) {
    return [...filteredList];
  }

  if (filter.state === StateFilter.completed) {
    filteredList = filteredList.filter((todo: ITodo) => todo.completed === true);
  }

  if (filter.state === StateFilter.uncompleted) {
    filteredList = filteredList.filter((todo: ITodo) => todo.completed === false);
  }

  return [...filteredList];
}

function sortList(list: ITodo[], sort: ISort) : ITodo[] {
  let sortResult = [];
  
  if (sort.column === 'createdAt') {
    if (sort.direction === SortDirection.Asc) {
      sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)]
    } else {
      sortResult = [...list.sort((a: ITodo, b: ITodo) => a.createdAt < b.createdAt ? 1 : -1)]
    }

    return sortResult;
  }

  if (sort.direction === SortDirection.Asc) {
    sortResult = [...list.sort((a: any, b: any) => a[sort.column] > b[sort.column] ? 1 : -1)]
  } else {
    sortResult = [...list.sort((a: any, b: any) => a[sort.column] < b[sort.column] ? 1 : -1)]
  }

  return sortResult;
}