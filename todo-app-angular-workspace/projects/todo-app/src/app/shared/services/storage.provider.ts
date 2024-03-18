import { Injectable, InjectionToken } from "@angular/core";
import { delay, Observable, of } from "rxjs";

export const StorageProviderKey = new InjectionToken('Storage InjectionToken');

export interface IStorageProvider {
  getItem(key: string): Observable<string | null | undefined>;
  setItem(key: string, value: any): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProvider {
  get storage(): Storage {
    return localStorage;
  }

  getItem(key: string): Observable<string | null | undefined> {
    return of(this.storage.getItem(key)).pipe(delay(800));
  }

  setItem(key: string, value: any): Observable<any> {
    let json = JSON.stringify(value);
    this.storage.setItem(key, json);
    return of({});
  }
}

export class BackendStorageProvider {
  getItem(key: string): Observable<string | null | undefined> {
    // TODO: read from backend API by using http request
    return of("");
  }

  setItem(key: string, value: any): Observable<any> {
    // TODO: save to backend API by using http request
    return of({});
  }
}
