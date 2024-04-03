import { Component, OnInit } from '@angular/core';
import { TodoListActions } from '../../../shared/state/todo.actions';
import { Store } from '@ngrx/store';
import { ISettings, PaginationType } from '../../../shared/models/settings';
import { IState } from '../../../shared/state/state';
import { selectSettings } from '../../../shared/state/todo.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination-settings',
  templateUrl: './pagination-settings.component.html',
  styleUrls: ['./pagination-settings.component.scss']
})
export class PaginationSettingsComponent implements OnInit {
  private settings: ISettings = {} as ISettings;
  readonly PaginationType: typeof PaginationType = PaginationType;
  paginationType!: PaginationType;
  maxVisiblePages!: number;
  isPaginationDisabled: boolean = false;
  private subscription!: Subscription;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => {
          this.paginationType = settings.pagination.paginationType;
          this.maxVisiblePages = settings.pagination.maxVisiblePages;
          this.isPaginationDisabled = !settings.general.isPaginationEnabled;
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
        pagination: {
          paginationType: this.paginationType,
          maxVisiblePages: this.maxVisiblePages
        }
      }
    }));
  }

  onPaginationTypeChange(paginationType: PaginationType){
    this.paginationType = paginationType;
    this.onSettingsUpdate();
  }

  onMaxVisiblePagesChange(maxVisiblePages: number) {
    this.maxVisiblePages = maxVisiblePages;
    this.onSettingsUpdate();
  }
}
