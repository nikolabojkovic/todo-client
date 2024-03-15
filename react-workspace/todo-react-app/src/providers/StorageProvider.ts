import { delay, Observable, of } from "rxjs";

export interface IStorageProvider {
  getItem(key: string): Observable<string | null>;
  setItem(key: string, value: unknown): Observable<unknown>;
}

export class LocalStorageProvider implements IStorageProvider {

  localStorage: Storage = window.localStorage;

  get storage(): Storage {
    return this.localStorage;
  }

  getItem(key: string): Observable<string | null> {
    return of(this.storage.getItem(key)).pipe(delay(800));
  }

  setItem(key: string, value: unknown): Observable<unknown> {
    const jsonAsText = JSON.stringify(value);
    this.storage.setItem(key, jsonAsText);
    return of({});
  }
}

export const localStorageProvider: IStorageProvider = new LocalStorageProvider(); 

// export class BackendStorageProvider implements IStorageProvider {
//   getItem(key: string): Observable<string | null> {
//     // TODO: read from backend API by using http request
//     return of("");
//   }

//   setItem(key: string, value: any): Observable<any> {
//     // TODO: save to backend API by using http request
//     return of({});
//   }
// }