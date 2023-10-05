import { createContext, useContext, useReducer } from "react";
import { IPaging } from "../models/IPaging";
import { ITodoList } from "../models/ITodoList";
import { ITodo } from "../models/Todo";
import { TodoService } from "../services/TodoService";
 
export const TodosContext = createContext({} as ITodoList);
export const TodosDispatchContext = createContext(null as any);
export const todoService: TodoService = new TodoService();

export function TodoListProvider({ children }: any) {
  const [todoList, dispatch] = useReducer(
    todoListReducer,
    todoService.getTodoList()
  );

  return (
    <TodosContext.Provider value={todoList}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  );
}

export function useTodoList() {
  return useContext(TodosContext);
}

export function useTodoListDispatch() {
  return useContext(TodosDispatchContext);
}

function todoListReducer(todoList: ITodoList, action: any) {
  switch (action.type) {
    case 'added': {
      const id = todoList.originalList.length >= 1 
      ? todoList.originalList
          .sort((a: ITodo, b: ITodo) => a.id > b.id ? 1 : -1)[todoList.originalList.length - 1].id 
      : 0;
      const newTodo = {
        id: id + 1,
        title: action.title,
        description: action.description,
        completed: false, 
        createdAt: new Date()
      } as ITodo;

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
    }
    case 'changed': {
      return {
        ...todoList,
        originalList: todoList.originalList.map(t => {
          if (t.id === action.todo.id) {
            return action.todo;
          } else {
            return t;
          }
        }),
        displayList: todoList.displayList.map(t => {
          if (t.id === action.todo.id) {
            return action.todo;
          } else {
            return t;
          }
        }),
        paging: {...todoList.paging}
      } as ITodoList;
    }
    case 'deleted': {
      return {
        ...todoList,
        originalList: todoList.originalList.filter(t => t.id !== action.id),
        displayList: todoList.displayList.filter(t => t.id !== action.id),
        paging: {
          ...todoList.paging, 
          totalCount: todoList.paging.totalCount - 1,
          activePage: calculateActivePageOnDelete(todoList.paging),
          startIndex: (calculateActivePageOnDelete(todoList.paging) - 1) * todoList.paging.itemsPerPage,
          endIndex: calculateActivePageOnDelete(todoList.paging) * todoList.paging.itemsPerPage,  
        } as IPaging
      } as ITodoList;
    }
    case 'paging-updated': {
      return {
        ...todoList,
        paging: {
          ...todoList.paging,
          activePage: action.activePage,
          itemsPerPage: action.itemsPerPage,
          startIndex: (action.activePage - 1) * action.itemsPerPage,
          endIndex: action.activePage * action.itemsPerPage
        } as IPaging
      } as ITodoList
    }
    case 'searched': {
      const filteredList = todoService.filter(todoList.originalList, todoList.filter);
      const searchedList = todoService.search(filteredList, action.searchTerm);
      return {
        ...todoList,
        displayList: [...searchedList],
        search: { searchTerm: action.searchTerm },
        paging: {
          ...todoList.paging,
          activePage: action.activePage,
          totalCount: searchedList.length,
          startIndex: (action.activePage - 1) * todoList.paging.itemsPerPage,
          endIndex: action.activePage * todoList.paging.itemsPerPage
        } as IPaging
      }
    }
    case 'searchTerm-updated': {
      return {
        ...todoList,
        search: { searchTerm: action.searchTerm },
      }
    }
    case 'filtered': {
      const filteredList = todoService.filter(todoList.originalList, action.filter);
      const searchedList = todoService.search(filteredList, todoList.search.searchTerm);
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
      }
    }
    case 'sorted': {
      const filteredList = todoService.filter(todoList.originalList, todoList.filter);
      const searchedList = todoService.search(filteredList, todoList.search.searchTerm);
      const sortedList = todoService.sort(searchedList, action.sort);

      return {
        ...todoList,
        displayList: [...sortedList],
        sort: {...action.sort},
        paging: {...todoList.paging} as IPaging
      }
    }
    case 'imported': {
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
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function calculateActivePageOnDelete(paging: IPaging) {
  return Math.ceil((paging.totalCount - 1) / paging.itemsPerPage) < paging.activePage
    ? paging.activePage - 1 : paging.activePage;
}

function calculateActivePageOnAdd(paging: IPaging) {
  return Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) > paging.activePage
    ? Math.ceil((paging.totalCount + 1) / paging.itemsPerPage) : paging.activePage;
}