import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { IGeneralSettings, ISettings, ListContainerType } from '../../../shared/models';
import {
  IState,
  TodoListActions,
  selectSettings
} from '../../../shared/state';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSlideToggleModule,
    BsDropdownModule
  ],
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  isConfirmEnabled: boolean = true;
  isPaginationEnabled: boolean = true;
  isInfiniteScrollEnabled: boolean = false;
  listSizeType: ListContainerType = ListContainerType.Fixed;
  fixedListSize: number = 200;
  public readonly ListContainerType : typeof ListContainerType = ListContainerType;
  private settings: ISettings = {} as ISettings;
  private subscription!: Subscription;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => {
          this.isConfirmEnabled = settings.general.isConfirmEnabled;
          this.isPaginationEnabled = settings.general.isPaginationEnabled;
          this.isInfiniteScrollEnabled = settings.general.isInfiniteScrollEnabled;
          this.listSizeType = settings.general.listSizeType;
          this.fixedListSize = settings.general.fixedListSize;
          this.settings = settings;
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSettingsUpdate(generalSettingsPayload: IGeneralSettings): void {
    this.store.dispatch(TodoListActions.settingsUpdated({
      payload: {
      ...this.settings,
        general: { ...generalSettingsPayload }
      }
    }));
  }

  onListSizeTypeChange(listSizeType: ListContainerType) {
    this.listSizeType = listSizeType;
    this.onSettingsUpdate({
      ...this.settings.general,
      listSizeType: this.listSizeType
    });
  }

  onFixedListSizeChange() {
    this.onSettingsUpdate({
      ...this.settings.general,
      fixedListSize: this.fixedListSize
    });
  }
}
