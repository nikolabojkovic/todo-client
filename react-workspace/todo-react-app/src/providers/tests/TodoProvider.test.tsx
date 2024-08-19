import { first, of } from 'rxjs';

import { ITodo, IFilter, StateFilter, ISort, SortDirection } from '../../models';
import providers, { GetListProps, IStorageProvider } from '..';
import localTodoListProvider from '../TodoProvider';

const testData = [
  {"id":1, "sortId": 1, "title":"Task 1","description":"Description 1","completed":false,"createdAt":"2022-02-03T23:00:00.000Z"},  
  {"id":7, "sortId": 2, "title":"Task 7","description":"desc","completed":false,"createdAt":"2023-03-27T13:01:43.461Z"},
  {"id":4, "sortId": 3, "title":"Task 4","description":"Description 4","completed":true,"createdAt":"2022-02-06T23:00:00.000Z"}
];
let localStorageProvider: IStorageProvider;

beforeEach(() => {
  localStorageProvider = {
    getItem: jest.fn().mockImplementation(() => of(JSON.stringify(testData))),
    setItem: jest.fn().mockImplementation(() => of({}))
  } as unknown as IStorageProvider;
  jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(localStorageProvider.getItem);
  jest.spyOn(providers.storageProvider, 'setItem').mockImplementation(localStorageProvider.setItem);
});

describe('TodoProvider', () => {
  it('get list should invoke getItem', (done) => {
    localTodoListProvider.getList({} as GetListProps)
      .pipe(first())
      .subscribe(() => {
        expect(localStorageProvider.getItem).toBeCalledWith('todo-list');
        done();
      });  
  }, 100);

  it('get list should return list', (done) => {
    localTodoListProvider.getList({} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length > 0).toBeTruthy();
        expect(todoList.length).toBe(3);
        done();
      });  
  }, 100);

  it('get list should return empty list', (done) => {
    localStorageProvider.getItem = jest.fn().mockImplementation(() => of(undefined));
    jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(localStorageProvider.getItem);
    localTodoListProvider.getList({} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(0);
        done();
      });  
  }, 100);

  it('should filter completed todo list', (done) => {
    localTodoListProvider.getList({filter: {state: StateFilter.completed} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].completed).toBeTruthy();
        done();
      });  
  }, 100);

  it('should filter uncopmleted todo list', (done) => {
    localTodoListProvider.getList({filter: {state: StateFilter.uncompleted} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(2);
        expect(todoList[0].completed).toBeFalsy();
        done();
      });  
  }, 100);

  it('should filter all todo list', (done) => {
    localTodoListProvider.getList({filter: {state: StateFilter.all} as IFilter} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        done();
      });  
  }, 100);

  it('should search todo list and return one item', (done) => {
    const searchTerm = 'Task 1';

    localTodoListProvider.getList({searchTerm} as GetListProps)
      .pipe(first())  
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0].title).toBe(searchTerm);
        done();
      });  
  });

  it('should search todo list and return all', (done) => {
    const searchTerm = '';

    localTodoListProvider.getList({searchTerm} as GetListProps)
      .pipe(first())  
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        done();
      });  
  });

  it('should sort todo list by title asc', (done) => {
    localTodoListProvider.getList({sort: { column: 'title', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        done();
      }); 
  }, 100);

  it('should sort todo list by title desc', (done) => {
    localTodoListProvider.getList({sort: { column: 'title', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        done();
      });
  }, 100);

  it('should sort todo list by date asc', (done) => {
    localTodoListProvider.getList({sort: { column: 'createdAt', direction: SortDirection.Asc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeLessThan(Date.parse(todoList[1].createdAt.toString()));
        done();
      }); 
  }, 100);

  it('should sort todo list by date desc', (done) => {
    localTodoListProvider.getList({sort: { column: 'createdAt', direction: SortDirection.Desc} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[2].title).toBe('Task 1');
        expect(Date.parse(todoList[0].createdAt.toString())).toBeGreaterThan(Date.parse(todoList[1].createdAt.toString()));
        done();
      });
  }, 100);

  it('should sort list manually', (done) => {
    localTodoListProvider.getList({sort: { column: 'sortId', direction: SortDirection.None} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 1');
        expect(todoList[1].title).toBe('Task 7');
        expect(todoList[2].title).toBe('Task 4');
        done();
      });
  }, 100);

  
  it('should sort list manually when reordered', (done) => {
    const reorderedTestData = [
      {"id":1, "sortId": 2, "title":"Task 1","description":"Description 1","completed":false,"createdAt":"2022-02-03T23:00:00.000Z"}, 
      {"id":7, "sortId": 1, "title":"Task 7","description":"desc","completed":false,"createdAt":"2023-03-27T13:01:43.461Z"}, 
      {"id":4, "sortId": 3, "title":"Task 4","description":"Description 4","completed":true,"createdAt":"2022-02-06T23:00:00.000Z"}
    ];
    jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(jest.fn().mockImplementation(() => of(JSON.stringify(reorderedTestData))));
    localTodoListProvider.getList({sort: { column: 'sortId', direction: SortDirection.None} as ISort} as GetListProps)
      .pipe(first())
      .subscribe((todoList: ITodo[]) => {
        expect(todoList !== null).toBeTruthy();
        expect(todoList.length).toBe(3);
        expect(todoList[0].title).toBe('Task 7');
        expect(todoList[1].title).toBe('Task 1');
        expect(todoList[2].title).toBe('Task 4');
        done();
      });
  }, 100);

  it('should save list', (done) => {
    const expectedList = [{
      id: 1,
      completed: false,
      createdAt: new Date(2023, 10, 18),
      description: "Test created description",
      title: "Test created title"
    } as ITodo] as ITodo[];

    localTodoListProvider.saveList(expectedList)
      .pipe(first())
      .subscribe(() => {
        expect(localStorageProvider.setItem).toBeCalledWith('todo-list', expectedList);
        done();
      });
  }, 100);
});