import { Observable, map } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';

import { ISettings } from '../models';
import { IStorageProvider, StorageProviderKey } from './';
import { State } from '../state';

export const SettingsProviderKey = new InjectionToken('Setting InjectionToken');

export interface ISettingsService {
  loadSettings(): Observable<ISettings>;
  saveSettings(settings: ISettings): Observable<unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class LocalSettingsService implements ISettingsService {
  settingsKey = 'todo-settings';

  constructor(@Inject(StorageProviderKey) private storageProvider: IStorageProvider) {}

  loadSettings(): Observable<ISettings> {
    return this.storageProvider.getItem(this.settingsKey)
    .pipe(
      map((settings) => {
        if (!settings) {
          return (new State([])).settings as ISettings;
        }

        return JSON.parse(settings) as ISettings;
      })
    );
  }

  saveSettings(settings: ISettings): Observable<unknown> {
    return this.storageProvider.setItem(this.settingsKey, settings);
  }
}
