import { Injectable, InjectionToken } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export const StorageProviderKey = new InjectionToken('Storage InjectionToken');

export interface IStorageProvider {
  getItem(key: string): Observable<string | null | undefined>;
  setItem(key: string, value: unknown): Observable<unknown>;
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

  setItem(key: string, value: unknown): Observable<unknown> {
    const json = JSON.stringify(value);
    this.storage.setItem(key, json);
    return of({});
  }
}

export class BackendStorageProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(key: string): Observable<string | null | undefined> {
    // TODO: read from backend API by using http request
    return of('');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem(key: string, value: unknown): Observable<unknown> {
    // TODO: save to backend API by using http request
    return of({});
  }
}
