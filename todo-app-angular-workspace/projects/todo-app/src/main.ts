import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import {
  AlertService,
  LocalSettingsService,
  LocalStorageProvider,
  SettingsProviderKey,
  StorageProviderKey,
  TodoService
} from './app/shared/services';
import { ConfirmModalService } from './app/components';
import { TodoEffects, todosReducer } from './app/shared/state';

// import { SortButtonModule } from 'sort-button';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      StoreModule.forRoot({ todos: todosReducer }),
      EffectsModule.forRoot([TodoEffects]),
      BrowserAnimationsModule
    ]),
    BsModalService,
    {
      provide: StorageProviderKey,
      useClass: LocalStorageProvider
    },
    {
      provide: SettingsProviderKey,
      useClass: LocalSettingsService
    },
    TodoService,
    ConfirmModalService,
    AlertService
  ]
});

