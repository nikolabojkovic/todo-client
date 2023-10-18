import { Observable, of } from "rxjs";

export interface IStorageProvider {
  getItem(key: string): Observable<string | null>;
  setItem(key: string, value: any): Observable<any>;
}


export class LocalStorageProvider {
  getItem(key: string): Observable<string | null> {
    return of(localStorage.getItem(key));
  }

  setItem(key: string, value: any): Observable<any> {
    let json = JSON.stringify(value);
    localStorage.setItem(key, json);
    return of({});
  }
}

export class BackendStorageProvider {
  getItem(key: string): Observable<string | null> {
    // TODO: read from backend API by using http request
    return of("");
  }

  setItem(key: string, value: any): Observable<any> {
    // TODO: save to backend API by using http request
    return of({});
  }
}