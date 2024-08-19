import { first } from "rxjs";

import { stateTestData } from "../../context";
import { LocalStorageProvider } from "..";

let storageProviderSpy: jest.SpyInstance<Storage, []>;
const storageProvider = new LocalStorageProvider();

beforeEach(() => {
  storageProviderSpy = jest.spyOn(storageProvider, 'storage', 'get').mockReturnValue(({    
    getItem: jest.fn().mockReturnValue(JSON.stringify(stateTestData.originalList)),
    setItem: jest.fn()
  } as unknown as Storage));
});

afterEach(() => {
  storageProviderSpy.mockRestore();
});

describe('StorageProvider', () => {
  it('should invoke getItem', (done) => {
    storageProvider.getItem('todo-list-test')
      .pipe(
        first()
      )
      .subscribe((data : string | null) => {
        expect(data).toBe(JSON.stringify(stateTestData.originalList));
        done(); 
      });

    expect(storageProvider.storage.getItem).toBeCalledWith('todo-list-test');  
  });

  it('should invoke setItem', (done) => {
    storageProvider.setItem('todo-list-test', stateTestData.originalList)
      .pipe(
        first()
      )
      .subscribe(() => {
        done(); 
      });

    expect(storageProvider.storage.setItem).toBeCalledWith('todo-list-test', JSON.stringify(stateTestData.originalList));  
  });

  it('should return global localStorage object', () => {
    const localStorageProvider = new LocalStorageProvider();

    expect(localStorageProvider.storage).toBe(localStorage);  
  });
});