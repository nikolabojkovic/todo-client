import { Observable, exhaustMap, first, of } from 'rxjs';
import { IFilter } from '../models/filter';
import { ISort, SortDirection } from '../models/sort';
import { TodoService } from './todo.service';
import { ITodo } from '../models/todo';
import { IStorageProvider, LocalStorageProvider } from './storage.provider';
import { todos } from '../../tests/test-data';

describe('todo service', () => {
  let localStorage: IStorageProvider;
  let todoService: TodoService;

  beforeEach(() => {
    localStorage = new LocalStorageProvider();
    todoService = new TodoService(localStorage);
  });

  describe('getList', () => {
    it('should get empty list for null from storage', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(null));

      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get empty list for undefined from storage', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(undefined));

      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get empty list for empty string from storage', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(''));

      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get todo list from storage', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length > 0).toBeTruthy();
          expect(todoList.length).toBe(6);
          done();
        });
    }, 100);
  });

  describe('filter list', () => {
    it('should filter completed todo list', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({completed: true, uncompleted: false} as IFilter)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(1);
          expect(todoList[0].completed).toBeTruthy();
          done();
        });
    }, 100);

    it('should filter uncopmleted todo list', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({completed: false, uncompleted: true} as IFilter)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(5);
          expect(todoList[0].completed).toBeFalsy();
          done();
        });
    }, 100);
    it('should filter todo list with both filter applied', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({completed: true, uncompleted: true} as IFilter)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(6);
          expect(todoList[0].completed).toBeFalsy();
          done();
        });
    }, 100);
  });

  describe('sort list', () => {
    it('should sort todo list by title asc', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({} as IFilter, { column: 'title', direction: SortDirection.Asc} as ISort)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(6);
          expect(todoList[0].title).toBe('Task 1');
          done();
        });
    }, 100);

    it('should sort todo list by title desc', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({} as IFilter, { column: 'title', direction: SortDirection.Desc} as ISort)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(6);
          expect(todoList[5].title).toBe('Task 1');
          done();
        });
    }, 100);

    it('should sort todo list by date asc', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

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

    it('should sort todo list by date desc', (done: DoneFn) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

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
  });

  describe('search list', () => {
    it('should search todo list', (done: DoneFn) => {
      var searchTerm = 'Task 1';
      spyOn(localStorage, 'getItem').and.returnValue(of(JSON.stringify(todos)));

      todoService.getList({} as IFilter, {} as ISort, searchTerm)
        .pipe(first())
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(1);
          expect(todoList[0].title).toBe(searchTerm);
          done();
        });
    }, 100);
  });

  describe('save list', () => {
    it('should save list', (done: DoneFn) => {
      const expectedList = [{
        id: 1,
        completed: false,
        createdAt: new Date(2023, 10, 18),
        description: "Test created description",
        title: "Test created title"
      } as ITodo] as ITodo[];
      spyOn(localStorage, 'setItem').and.callFake((key: string, value: any): Observable<any> => of({}));

      todoService.saveList(expectedList)
        .pipe(first())
        .subscribe(() => {
          expect(localStorage.setItem).toHaveBeenCalledWith('todo-list', expectedList)
          done();
        });
    }, 100);
  });
});
