import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo';
import { BackendStorageProvider, IStorageProvider, LocalStorageProvider } from './storage.provider';
import { todos } from '../../tests/test-data';

describe('local storage provider', () => {
  describe('getItem', () => {
    it('should get item from storage', (done: DoneFn) => {
      const localStorageProvider = new LocalStorageProvider();
      const mockedLocalStorage = {
        getItem: (): Observable<string | null | undefined> => of(JSON.stringify(todos)),
        setItem: (): Observable<unknown> => of({})
      } as unknown as Storage;
      const data = `[{
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
        createdAt: "2024-01-23T10:54:55.504Z"
      }]`;
      spyOnProperty(localStorageProvider, 'storage', 'get').and.returnValue(mockedLocalStorage);
      spyOn(mockedLocalStorage, 'getItem').and.returnValue(data);

      localStorageProvider.getItem('todo-list')
        .subscribe((value: string | null | undefined) => {
          expect(mockedLocalStorage.getItem).toHaveBeenCalledWith('todo-list');
          expect(value).toBe(data);
          done();
        });
    }, 900);
  });

  describe('setItem', () => {
    it('should set item to storage', (done: DoneFn) => {
      const localStorageProvider = new LocalStorageProvider();
      const mockedLocalStorage = {
        getItem: (): Observable<string | null | undefined> => of(JSON.stringify(todos)),
        setItem: (): Observable<unknown> => of({})
      } as unknown as Storage;
      const data = [{
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        createdAt: new Date(2022, 1, 4)
      } as Todo] as Todo[];
      spyOnProperty(localStorageProvider, 'storage', 'get').and.returnValue(mockedLocalStorage);
      spyOn(mockedLocalStorage, 'getItem').and.returnValue('');
      spyOn(mockedLocalStorage, 'setItem').and.returnValue();

      localStorageProvider.setItem('todo-list',  data)
        .subscribe(() => {
          expect(mockedLocalStorage.setItem).toHaveBeenCalledWith('todo-list', JSON.stringify(data));
          done();
        });
    }, 100);
  });

  describe('storage property', () => {
    it('sould return global localStorage object', () => {
      const localStorageProvider = new LocalStorageProvider();

      expect(localStorageProvider.storage).toBe(localStorage);
    });
  });
});

describe('backend storage provider', () => {
  let localStorageProvider: IStorageProvider;

  beforeEach(() => {
    localStorageProvider = new BackendStorageProvider();
  });

  describe('getItem', () => {
    it('should get item from storage', (done: DoneFn) => {
      localStorageProvider.getItem('todo-list')
        .subscribe(() => {
          expect(true).toBe(true);
          done();
        });
    }, 900);
  });

  describe('setItem', () => {
    const data = [{
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date(2022, 1, 4)
    } as Todo] as Todo[];
    it('should set item to storage', (done: DoneFn) => {
      localStorageProvider.setItem('todo-list', data)
        .subscribe(() => {
          expect(true).toBe(true);
          done();
        });
    }, 100);
  });
});
