import { Observable, map } from "rxjs";

import { ISettings } from "../models";
import { storageProvider } from "./";
import { State } from "../context";

export interface ISettingsProvider {
  loadSettings(): Observable<ISettings>;
  saveSettings(settings: ISettings): Observable<unknown>;
}

export class LocalSettingsProvider implements ISettingsProvider {
  settingsKey = 'todo-settings';

  loadSettings(): Observable<ISettings> {
    return storageProvider.getItem(this.settingsKey)
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
    return storageProvider.setItem(this.settingsKey, settings);
  }
}

export default new LocalSettingsProvider();