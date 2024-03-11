import { IFilter, StateFilter } from '../models/IFilter';
import { ISort, SortDirection } from '../models/ISort';
import { ITodo } from '../models/Todo';
import { getList, GetListProps, saveList } from './TodoProvider';
import { MockLocalStorageProvider } from '../Mocks/LocalStorageProvider.mock';
import { exhaustMap, first } from 'rxjs';
import { IStorageProvider } from './StorageProvider';

describe('todo service', () => {
  let mockLocalStorage: IStorageProvider = new MockLocalStorageProvider();

  beforeEach(() => {
    mockLocalStorage = new MockLocalStorageProvider();
  });
  
  it('get todo list', (done) => {
    getList({provider: mockLocalStorage} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length > 0).toBeTruthy();
        expect(todoList.length).toBe(3);
        done();
      });  
  }, 100);

  it('filter completed todo list', (done) => {
    getList({provider: mockLocalStorage, filter: {state: StateFilter.completed} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].completed).toBeTruthy();
        done();
      });  
  }, 100);

  it('filter uncopmleted todo list', (done) => {
    getList({provider: mockLocalStorage, filter: {state: StateFilter.uncompleted} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(2);
        expect(todoList[0].completed).toBeFalsy();
        done();
      });  
  }, 100);

  it('search todo list', (done) => {
    var searchTerm = 'Task 1';

    getList({provider: mockLocalStorage, searchTerm} as GetListProps)
      .pipe(first())  
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].title).toBe(searchTerm);
        done();
      });  
  });

  it('sort todo list by title asc', (done) => {   
    getList({provider: mockLocalStorage, sort: { column: 'title', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        done();
      }); 
  }, 100);

  it('sort todo list by title desc', (done) => {
    getList({provider: mockLocalStorage, sort: { column: 'title', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        done();
      });
  }, 100);

  it('sort todo list by date asc', (done) => {   
    getList({provider: mockLocalStorage, sort: { column: 'createdAt', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeLessThan(Date.parse(todoList[1].createdAt.toString()))
        done();
      }); 
  }, 100);

  it('sort todo list by date desc', (done) => {
    getList({provider: mockLocalStorage, sort: { column: 'createdAt', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeGreaterThan(Date.parse(todoList[1].createdAt.toString()))
        done();
      });
  }, 100);

  it('save list', (done) => {
    const expectedList = [{
      id: 1,
      completed: false,
      createdAt: new Date(2023, 10, 18),
      description: "Test created description",
      title: "Test created title"
    } as ITodo] as ITodo[];

    // NOTE: merge observables on emit
    // let result = todoService.saveList(expectedList).pipe(first(), concatMap(() => todoService.getList()));
    // result.pipe(first()).subscribe((list) => {
    //   expect(list.length).toBe(1);
    //   expect(list[0].title).toBe("Test created title");
    //   done();
    // });

    // NOTE: merge observables when first observable completed
    saveList(mockLocalStorage, expectedList)
      .pipe(first(), exhaustMap(() => mockLocalStorage.getItem('todo-list')))
        .pipe(first()).subscribe((data) => {
          const actualList = JSON.parse(data!) as ITodo[];
          expect(actualList.length).toBe(1);
          expect(actualList[0].title).toBe(expectedList[0].title);
          done();
        });
  }, 100);
});