import { createReducer, on } from '@ngrx/store';

import { TodoListActions } from './todos.actions';
import { ITodoList } from '../shared/models/ITodoList';
import { IPaging } from '../shared/models/IPaging';
import { ITodo } from '../shared/models/todo';
import { initTodoList } from '../shared/initial-data';

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
    const filteredList = filter(todoList.originalList, todoList.filter);
    const searchedList = search(filteredList, searchTerm);
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
  on(TodoListActions.filtered, (todoList, { action }) => {
    const filteredList = filter(todoList.originalList, action.filter);
    const searchedList = search(filteredList, todoList.search.searchTerm);
    return {
      ...todoList,
      displayList: [...searchedList],
      filter: {...action.filter},
      paging: {
        ...todoList.paging,
        activePage: action.activePage,
        totalCount: searchedList.length,
        startIndex: (action.activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: action.activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.imported, (todoList, { action }) => {
    return {
      ...todoList,
      originalList: [...action.originalList],
      displayList: [...action.originalList],
      search: { searchTerm: '' },
      filter: {
        completed: false,
        uncompleted: false
       },
      paging: {
        ...todoList.paging,
        activePage: action.activePage,
        totalCount: action.originalList.length,
        startIndex: (action.activePage - 1) * todoList.paging.itemsPerPage,
        endIndex: action.activePage * todoList.paging.itemsPerPage
      } as IPaging
    } as ITodoList
  }),
  on(TodoListActions.sorted, (todoList, { action }) => {
    const filteredList = filter(todoList.originalList, todoList.filter);
    const searchedList = search(filteredList, todoList.search.searchTerm);
    const sortedList = sort(searchedList, action.sort);

    return {
      ...todoList,
      displayList: [...sortedList],
      sort: {...action.sort},
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

function search(list: ITodo[], searchTerm: string,) {
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

function filter(list: ITodo[], filter: any = null) {
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

function sort(list: ITodo[], sort: any) {
  let sortResult = [];
  
  if (sort.column === 'createdAt') {
    if (sort.direction === 'asc') {
      sortResult = [...list.sort((a: any, b: any) => Date.parse(a[sort.column]) > Date.parse(b[sort.column]) ? 1 : -1)]
    } else {
      sortResult = [...list.sort((a: any, b: any) => Date.parse(a[sort.column]) < Date.parse(b[sort.column]) ? 1 : -1)]
    }

    return sortResult;
  }

  if (sort.direction === 'asc') {
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