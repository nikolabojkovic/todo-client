import { Component, OnInit } from '@angular/core';
import { TodoListActions } from '../../../shared/state/todo.actions';
import { Store } from '@ngrx/store';
import { IState } from '../../../shared/state/state';
import { ISettings } from '../../../shared/models/settings';
import { selectSettings } from '../../../shared/state/todo.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {
  isSearchOnKeyPressEnabled: boolean = false;
  debounceTime: number = 500;
  private settings: ISettings = {} as ISettings;
  private subscription!: Subscription;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
    .pipe()
    .subscribe((settings: ISettings) => {
      this.isSearchOnKeyPressEnabled = settings.search.isSearchOnKeyPressEnabled;
      this.debounceTime = settings.search.debounceTime;
      this.settings = settings;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSettingsUpdate(): void {
    this.store.dispatch(TodoListActions.settingsUpdated({
      payload: {
      ...this.settings,
        search: {
          isSearchOnKeyPressEnabled: this.isSearchOnKeyPressEnabled,
          debounceTime: this.debounceTime
        }
      }
    }));
  }
}
