import { delay, Observable, of } from "rxjs";

export interface IStorageProvider {
  getItem(key: string): Observable<string | null>;
  setItem(key: string, value: any): Observable<any>;
}


export class LocalStorageProvider implements IStorageProvider {
  getItem(key: string): Observable<string | null> {
    return of(localStorage.getItem(key)).pipe(delay(800));
  }

  setItem(key: string, value: any): Observable<any> {
    let json = JSON.stringify(value);
    localStorage.setItem(key, json);
    return of({});
  }
}

export const localStorageProvider: IStorageProvider = new LocalStorageProvider(); 

export class BackendStorageProvider implements IStorageProvider {
  getItem(key: string): Observable<string | null> {
    // TODO: read from backend API by using http request
    return of("");
  }

  setItem(key: string, value: any): Observable<any> {
    // TODO: save to backend API by using http request
    return of({});
  }
}