import { first } from "rxjs";
import { stateTestData } from "../context/testData";
import { LocalStorageProvider } from "./StorageProvider";

let storageProviderSpy: jest.SpyInstance<Storage, []>;
let localStorageMock: Storage;
const storageProvider = new LocalStorageProvider();

beforeEach(() => {
  storageProviderSpy = jest.spyOn(storageProvider, 'storage', 'get').mockReturnValue(({    
    getItem: jest.fn().mockReturnValue(JSON.stringify(stateTestData.originalList)),
    setItem: jest.fn()
  } as unknown as Storage));
  localStorageMock = (storageProviderSpy.getMockImplementation()!)();
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
      .subscribe((data) => {
        expect(data).toBe(JSON.stringify(stateTestData.originalList));
        done(); 
      });

    expect(localStorageMock.getItem).toBeCalledWith('todo-list-test');  
  });

  it('should invoke setItem', (done) => {
    storageProvider.setItem('todo-list-test', stateTestData.originalList)
      .pipe(
        first()
      )
      .subscribe(() => {
        done(); 
      });

    expect(localStorageMock.setItem).toBeCalledWith('todo-list-test', JSON.stringify(stateTestData.originalList));  
  });

  it('should return global localStorage object', () => {
    const localStorageProvider = new LocalStorageProvider();

    expect(localStorageProvider.storage).toBe(localStorage);  
  });
});