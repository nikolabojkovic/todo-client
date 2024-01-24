import { exhaustMap, first, of } from 'rxjs';
import { IFilter } from '../models/filter';
import { ISort, SortDirection } from '../models/sort';
import { TodoService } from './todo.service';
import { MockLocalStorageProvider } from '../../tests/mocks/local-storage.provider.mock';
import { ITodo } from '../models/todo';
import { IStorageProvider } from './storage.provider';

describe('todo service', () => {
  let mockLocalStorage: IStorageProvider;
  let todoService: TodoService;

  beforeEach(() => {
    mockLocalStorage = new MockLocalStorageProvider();
    todoService = new TodoService(mockLocalStorage);
  });

  describe('getList', () => {
    it('should get empty list for null from storage', (done: DoneFn) => {
      spyOn(mockLocalStorage, 'getItem').and.returnValue(of(null));
      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get empty list for undefined from storage', (done: DoneFn) => {
      mockLocalStorage.setItem('todo-list', undefined);
      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get empty list for empty string from storage', (done: DoneFn) => {
      spyOn(mockLocalStorage, 'getItem').and.returnValue(of(''));
      todoService.getList()
        .subscribe((todoList: ITodo[]) => {
          expect(todoList !== null).toBeTruthy();
          expect(todoList.length).toBe(0);
          done();
        });
    }, 100);

    it('should get todo list from storage', (done: DoneFn) => {
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
});
