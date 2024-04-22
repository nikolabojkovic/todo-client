import { Observable, map } from "rxjs";

import { ISettings } from "../models";
import { IStorageProvider, LocalStorageProvider } from "./";
import { State } from "../context";

export interface ISettingsProvider {
  loadSettings(): Observable<ISettings>;
  saveSettings(settings: ISettings): Observable<unknown>;
}

export class LocalSettingsProvider implements ISettingsProvider {
  settingsKey = 'todo-settings';

  storageProvider: IStorageProvider;

  constructor() {
    this.storageProvider = new LocalStorageProvider();
  }  

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