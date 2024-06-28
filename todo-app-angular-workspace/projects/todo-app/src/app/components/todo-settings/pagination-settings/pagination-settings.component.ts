import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { IState, TodoListActions, selectSettings } from '../../../shared/state';
import { ISettings, PaginationType } from '../../../shared/models';

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
  isPaginationDisabled: boolean | undefined = false;
  private subscription!: Subscription;

  constructor(private store: Store<IState>, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => {
          this.paginationType = settings.pagination.paginationType;
          this.maxVisiblePages = settings.pagination.maxVisiblePages;
          this.isPaginationDisabled = undefined;
          this.ref.detectChanges();
          this.isPaginationDisabled = !settings.general.isPaginationEnabled;
          this.ref.detectChanges();
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
