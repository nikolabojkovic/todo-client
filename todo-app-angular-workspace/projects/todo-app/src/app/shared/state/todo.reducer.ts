import { createReducer, on } from '@ngrx/store';

import { TodoListActions } from './todo.actions';
import { ITodoList } from '../models/todoList';
import { IPaging } from '../models/paging';
import { ITodo } from '../models/todo';
import { initTodoList } from '../initial-data';
import { ISort, SortDirection } from '../models/sort';
import { IFilter } from '../models/filter';

export const initialState: ITodoList = initTodoList;

export const todosReducer = createReducer(
  initialState,
  on(TodoListActions.fetched, (_state, { todoList }) => todoList),
  on(TodoListActions.removed, (todoList, { todoId }) => {
    return {
      ...todoList,
      originalList: todoList.originalList.filter(t => t.id !== todoId) as ITodo[],
      displayList: todoList.displayList.filter(t => t.id !== todoId) as ITodo[],
      paging: {
        ...todoList.paging, 
        totalCount: todoList.paging.totalCount - 1,
        activePage: calculateActivePageOnDelete(todoList.paging),
        startIndex: (calculateActivePageOnDelete(todoList.paging) - 1) * todoList.paging.itemsPerPage,
        endIndex: calculateActivePageOnDelete(todoList.paging) * todoList.paging.itemsPerPage,  
      } as IPaging
    } as ITodoList;
  }
  ),
  on(TodoListActions.completed, (todoList, { todoId }) => {
    return {
      ...todoList,
      originalList: todoList.originalList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      displayList: todoList.displayList.map(todo => {
        if (todo.id === todoId) {
          return {...todo, completed: true};
        } else {
          return todo;
        }
      }) as ITodo[],
      paging: {...todoList.paging}
    } as ITodoList;
  }
  ),
  on(TodoListActions.added, (todoList, { title, description } ) => {
    let lastElement = todoList.originalList[todoList.originalList.length - 1];
    let id = 0;
    if (lastElement) {
      id = lastElement.id + 1;
    }
    const newTodo = {
      id,
      title,
      description, 
      completed: false,
      createdAt: new Date() 
    }
    return {
      ...todoList,
      originalList: [...todoList.originalList, newTodo],
      displayList: [...todoList.displayList, newTodo],
      paging: {
        ...todoList.paging, 
        totalCount: todoList.paging.totalCount + 1,
        activePage: calculateActivePageOnAdd(todoList.paging),
        startIndex: (calculateActivePageOnAdd(todoList.paging) - 1) * todoList.paging.itemsPerPage,
        endIndex: calculateActivePageOnAdd(todoList.paging) * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList;
  }),
  on(TodoListActions.searched, (todoList, { searchTerm, activePage }) => {
    const filteredList = filterList(todoList.originalList, todoList.filter);
    const searchedList = searchList(filteredList, searchTerm);
    return {
      ...todoList,
      displayList: [...searchedList],
      search: { searchTerm: searchTerm },
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: searchedList.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.pagingUpdated, (todoList, { activePage, itemsPerPage }) => {
    return {
      ...todoList,
      paging: {
        ...todoList.paging,
        activePage: activePage,
        itemsPerPage: itemsPerPage,
        startIndex: (activePage - 1) * itemsPerPage,
        endIndex: activePage * itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.filtered, (todoList, { activePage, filter }) => {
    const filteredList = filterList(todoList.originalList, filter);
    const searchedList = searchList(filteredList, todoList.search.searchTerm);
    return {
      ...todoList,
      displayList: [...searchedList],
      filter: {...filter},
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: searchedList.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.imported, (todoList, { activePage, originalList }) => {
    return {
      ...todoList,
      originalList: [...originalList],
      displayList: [...originalList],
      search: { searchTerm: '' },
      filter: {
        completed: false,
        uncompleted: false
       },
      paging: {
        ...todoList.paging,
        activePage: activePage,
        totalCount: originalList.length,
        startIndex: (activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.sorted, (todoList, sort) => {
    const filteredList = filterList(todoList.originalList, todoList.filter);
    const searchedList = searchList(filteredList, todoList.search.searchTerm);
    const sortedList = sortList(searchedList, sort as ISort);

    return {
      ...todoList,
      displayList: [...sortedList],
      sort: {...sort},
      paging: {...todoList.paging} as IPaging
    } as ITodoList
  }),
  on(TodoListActions.searchTermUpdated, (todoList, { searchTerm }) => {
    return {
      ...todoList,
      search: { searchTerm },
    }
  })
);

function searchList(list: ITodo[], searchTerm: string,) {
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

function filterList(list: ITodo[], filter: IFilter | null = null) {
  let filteredList = list;

  if (filter && filter.completed && filter.uncompleted) {
    return [...filteredList];
  }

  if (filter?.completed) {
    filteredList = filteredList.filter((todo: ITodo) => todo.completed === true);
  }

  if (filter?.uncompleted) {
    filteredList = filteredList.filter((todo: ITodo) => todo.completed === false);
  }

  return [...filteredList];
}

function sortList(list: ITodo[], sort: ISort) {
  let sortResult = [];
  
  if (sort.column === 'createdAt') {
    if (sort.direction === 'asc') {
      sortResult = [...list.sort((a: ITodo , b: ITodo) => a.createdAt > b.createdAt ? 1 : -1)]
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

function calculateActivePageOnDelete(paging: IPaging) {
  return Math.ceil((paging.totalCount - 1) / paging.itemsPerPage) < paging.activePage
    ? paging.activePage - 1 : paging.activePage;
}

function calculateActivePageOnAdd(paging: IPaging) {
  return Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) > paging.activePage
    ? Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) : paging.activePage;
}