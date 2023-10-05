import { initTodoList } from "../context/initialData";
import { ISort } from "../models/ISort";
import { TodoList } from "../models/ITodoList";
import { ITodo } from "../models/Todo";

export class TodoService {

  private todoListName: string = 'todo-list';

  getTodoList() {
    if (localStorage.getItem(this.todoListName) === undefined 
     || localStorage.getItem(this.todoListName) === null) {
      return initTodoList;
    }
    
    const todos = this.sort(JSON.parse(localStorage.getItem(this.todoListName) ?? "[]") as ITodo[], {
      column: 'createdAt',
      direction: 'asc'
    } as ISort);
  
    let todoList = new TodoList(todos);

    return todoList;
  }

  saveTodoList(list: any): void {
    localStorage.setItem(this.todoListName, JSON.stringify(list));
  }
  
  search(list: ITodo[], searchTerm: string,) {
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
  
  filter(list: ITodo[], filter: any = null) {
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
  
  sort(list: ITodo[], sort: any) {
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
}