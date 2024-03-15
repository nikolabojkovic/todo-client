import { IFilter, StateFilter } from '../models/IFilter';
import { ISort, SortDirection } from '../models/ISort';
import { ITodo } from '../models/Todo';
import { IStorageProvider } from './StorageProvider';
import { getList, GetListProps, saveList } from './TodoProvider';
import { first, of } from 'rxjs';

const testData = [
  {"id":1,"title":"Task 1","description":"Description 1","completed":false,"createdAt":"2022-02-03T23:00:00.000Z"},
  {"id":4,"title":"Task 4","description":"Description 4","completed":true,"createdAt":"2022-02-06T23:00:00.000Z"},
  {"id":7,"title":"Task 7","description":"desc","completed":false,"createdAt":"2023-03-27T13:01:43.461Z"}
];
let localStorageProvider: IStorageProvider;

beforeEach(() => {
  localStorageProvider = {
    getItem: jest.fn().mockImplementation(() => of(JSON.stringify(testData))),
    setItem: jest.fn().mockImplementation(() => of({}))
  } as unknown as IStorageProvider;
});

describe('TodoProvider', () => {
  it('get list should invoke getItem', (done) => {
    getList({storageProvider: localStorageProvider} as GetListProps)
      .pipe(first())
      .subscribe(() => {
        expect(localStorageProvider.getItem).toBeCalledWith('todo-list');
        done();
      });  
  }, 100);

  it('get list should return list', (done) => {
    getList({storageProvider: localStorageProvider} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length > 0).toBeTruthy();
        expect(todoList.length).toBe(3);
        done();
      });  
  }, 100);

  it('filter completed todo list', (done) => {
    getList({storageProvider: localStorageProvider, filter: {state: StateFilter.completed} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].completed).toBeTruthy();
        done();
      });  
  }, 100);

  it('filter uncopmleted todo list', (done) => {
    getList({storageProvider: localStorageProvider, filter: {state: StateFilter.uncompleted} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(2);
        expect(todoList[0].completed).toBeFalsy();
        done();
      });  
  }, 100);

  it('search todo list', (done) => {
    const searchTerm = 'Task 1';

    getList({storageProvider: localStorageProvider, searchTerm} as GetListProps)
      .pipe(first())  
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].title).toBe(searchTerm);
        done();
      });  
  });

  it('sort todo list by title asc', (done) => {   
    getList({storageProvider: localStorageProvider, sort: { column: 'title', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        done();
      }); 
  }, 100);

  it('sort todo list by title desc', (done) => {
    getList({storageProvider: localStorageProvider, sort: { column: 'title', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        done();
      });
  }, 100);

  it('sort todo list by date asc', (done) => {   
    getList({storageProvider: localStorageProvider, sort: { column: 'createdAt', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeLessThan(Date.parse(todoList[1].createdAt.toString()));
        done();
      }); 
  }, 100);

  it('sort todo list by date desc', (done) => {
    getList({storageProvider: localStorageProvider, sort: { column: 'createdAt', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeGreaterThan(Date.parse(todoList[1].createdAt.toString()));
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

    saveList(localStorageProvider, expectedList)
      .pipe(first())
      .subscribe(() => {
        expect(localStorageProvider.setItem).toBeCalledWith('todo-list', expectedList);
        done();
      });
  }, 100);
});