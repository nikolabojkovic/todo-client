import { Observable, of } from "rxjs";
import { IStorageProvider } from "../../shared/services/storage.provider";
import { todos } from "../test-data";

export class MockLocalStorageProvider implements IStorageProvider {

  storage: Map<string, string> = new Map();

  constructor() {
    this.storage.set('todo-list', 
    JSON.stringify(todos));
  }

  getItem(key: string): Observable<string | null> {
    let value = this.storage.get(key);

    if (!value)
      return of(null);

    return of(value);
  }

  setItem(key: string, value: any): Observable<any> {
    let json = JSON.stringify(value);
    this.storage.set(key, json);
    return of({});
  }
}