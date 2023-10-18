import { exhaustMap, first } from 'rxjs';
import { IFilter } from '../../shared/models/filter';
import { ISort, SortDirection } from '../../shared/models/sort';
import { TodoService } from '../../shared/services/todo.service';
import { MockLocalStorageProvider } from '../mocks/local-storage-provider.mock';
import { ITodo } from '../models/todo';

describe('todo service', () => {
  let mockLocalStorage = new MockLocalStorageProvider();
  let todoService = new TodoService(mockLocalStorage);

  beforeEach(() => {
    mockLocalStorage = new MockLocalStorageProvider();
    todoService = new TodoService(mockLocalStorage);
  });

  it('get todo list', (done: DoneFn) => {
    todoService.getList({} as IFilter, {} as ISort)
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length > 0).toBeTruthy();
        expect(todoList.length).toBe(6);
        done();
      });  
  }, 100);

  it('filter completed todo list', (done: DoneFn) => {
    todoService.getList({completed: true, uncompleted: false} as IFilter, {} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].completed).toBeTruthy();
        done();
      });  
  }, 100);

  it('filter uncopmleted todo list', (done: DoneFn) => {
    todoService.getList({completed: false, uncompleted: true} as IFilter, {} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(5);
        expect(todoList[0].completed).toBeFalsy();
        done();
      });  
  }, 100);

  it('search todo list', (done: DoneFn) => {
    var searchTerm = 'Task 1';

    todoService.getList({} as IFilter, {} as ISort, searchTerm)
      .pipe(first())  
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].title).toBe(searchTerm);
        done();
      });  
  }, 100);

  it('sort todo list by title asc', (done: DoneFn) => {
    todoService.getList({} as IFilter, { column: 'title', direction: SortDirection.Asc} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(6);
        expect(todoList[0].title).toBe('Task 1');
        done();
      }); 
  }, 100);

  it('sort todo list by title desc', (done: DoneFn) => {
    todoService.getList({} as IFilter, { column: 'title', direction: SortDirection.Desc} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(6);
        expect(todoList[5].title).toBe('Task 1');
        done();
      });
  }, 100);

  it('sort todo list by date asc', (done: DoneFn) => {   
    todoService.getList({} as IFilter, { column: 'createdAt', direction: SortDirection.Asc} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(6);
        expect(todoList[0].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeLessThan(Date.parse(todoList[1].createdAt.toString()))
        done();
      }); 
  }, 100);

  it('sort todo list by date desc', (done: DoneFn) => {
    todoService.getList({} as IFilter, { column: 'createdAt', direction: SortDirection.Desc} as ISort)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(6);
        expect(todoList[5].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeGreaterThan(Date.parse(todoList[1].createdAt.toString()))
        done();
      });
  }, 100);

  it('save list', (done: DoneFn) => {
    const expectedList = [{
      id: 1,
      completed: false,
      createdAt: new Date(2023, 10, 18),
      description: "Test created description",
      title: "Test created title"
    } as ITodo] as ITodo[];

    todoService.saveList(expectedList)
      .pipe(first(), exhaustMap(() => mockLocalStorage.getItem('todo-list')))
        .pipe(first()).subscribe((data) => {
          const actualList = JSON.parse(data!) as ITodo[];
          expect(actualList.length).toBe(1);
          expect(actualList[0].title).toBe(expectedList[0].title);
          done();
        });
  }, 100);
});