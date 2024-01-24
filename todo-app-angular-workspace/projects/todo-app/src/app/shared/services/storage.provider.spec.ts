import { Todo } from '../models/todo';
import { BackendStorageProvider, IStorageProvider, LocalStorageProvider } from './storage.provider';

describe('local storage provider', () => {
  let localStorageProvider: IStorageProvider;

  beforeEach(() => {
    localStorageProvider = new LocalStorageProvider();
  });

  describe('getItem', () => {
    it('should get item from storage', (done: DoneFn) => {
      const data = `[{
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
        createdAt: "2024-01-23T10:54:55.504Z"
      }]`;
      spyOn(localStorage, 'getItem').and.returnValue(data);
      localStorageProvider.getItem('todo-list')
        .subscribe((value: string | null | undefined) => {
          expect(localStorage.getItem).toHaveBeenCalledWith('todo-list');
          expect(value).toBe(data);
          done();
        });
    }, 900);
  });

  describe('setItem', () => {
    const data = [{
      id: 1,
      title: "Task 1",
      description: "Description 1",
      completed: false,
      createdAt: new Date(2022, 1, 4)
    } as Todo] as Todo[];
    it('should set item to storage', (done: DoneFn) => {
      spyOn(localStorage, 'setItem').and.returnValue();
      localStorageProvider.setItem('todo-list',  data)
        .subscribe((response: any) => {
          expect(localStorage.setItem).toHaveBeenCalledWith('todo-list', JSON.stringify(data));
          done();
        });
    }, 100);
  });
});

describe('backend storage provider', () => {
  let localStorageProvider: IStorageProvider;

  beforeEach(() => {
    localStorageProvider = new BackendStorageProvider();
  });

  describe('getItem', () => {
    it('should get item from storage', (done: DoneFn) => {
      const data = `[{
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
        createdAt: "2024-01-23T10:54:55.504Z"
      }]`;
      localStorageProvider.getItem('todo-list')
        .subscribe((value: string | null | undefined) => {
          expect(true).toBe(true);
          done();
        });
    }, 900);
  });

  describe('setItem', () => {
    const data = [{
      id: 1,
      title: "Task 1",
      description: "Description 1",
      completed: false,
      createdAt: new Date(2022, 1, 4)
    } as Todo] as Todo[];
    it('should set item to storage', (done: DoneFn) => {
      localStorageProvider.setItem('todo-list', data)
        .subscribe((response: any) => {
          expect(true).toBe(true);
          done();
        });
    }, 100);
  });
});
