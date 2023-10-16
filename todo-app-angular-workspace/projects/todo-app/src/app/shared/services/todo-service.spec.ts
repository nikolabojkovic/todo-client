import { IFilter } from '../../shared/models/filter';
import { ISort, SortDirection } from '../../shared/models/sort';
import { TodoService } from '../../shared/services/todo.service';

const todoService = new TodoService();

describe('todo service', () => {
  it('get todo list', (done: DoneFn) => {
    todoService.getTodoList().subscribe((todoList) => {
      expect(todoList !== null).toBeTruthy();
      expect(todoList.originalList.length > 0).toBeTruthy();
      expect(todoList.displayList.length).toBe(6);
      done();
    });    
  });

  // it('filter completed todo list', () => {
  //   let todoList = todoService.getTodoList();
  //   let filteredList = todoService.filter(todoList.originalList, {completed: true, uncompleted: false} as IFilter);
  //   expect(filteredList !== null).toBeTruthy();
  //   expect(filteredList.length).toBe(1);
  //   expect(filteredList[0].completed).toBeTruthy();
  // });

  // it('filter uncopmleted todo list', () => {
  //   let todoList = todoService.getTodoList();
  //   let filteredList = todoService.filter(todoList.originalList, {completed: false, uncompleted: true} as IFilter);
  //   expect(filteredList !== null).toBeTruthy();
  //   expect(filteredList.length).toBe(5);
  //   expect(filteredList[0].completed).toBeFalsy();
  // });

  // it('search todo list', () => {
  //   var title = 'Task 1';
  //   let todoList = todoService.getTodoList();
  //   let searchedList = todoService.search(todoList.originalList, title);
  //   expect(searchedList !== null).toBeTruthy();
  //   expect(searchedList.length).toBe(1);
  //   expect(searchedList[0].title).toBe(title);
  // });

  // it('sort todo list by title asc', () => {
  //   let todoList = todoService.getTodoList();
  //   let sortedList = todoService.sort(todoList.originalList, { column: 'title', direction: SortDirection.Asc} as ISort);
  //   expect(sortedList !== null).toBeTruthy();
  //   expect(sortedList.length).toBe(6);
  //   expect(sortedList[0].title).toBe('Task 1');
  // });

  // it('sort todo list by title desc', () => {
  //   let todoList = todoService.getTodoList();
  //   let sortedList = todoService.sort(todoList.originalList, { column: 'title', direction: SortDirection.Desc} as ISort);
  //   expect(sortedList !== null).toBeTruthy();
  //   expect(sortedList.length).toBe(6);
  //   expect(sortedList[5].title).toBe('Task 1');
  // });
});