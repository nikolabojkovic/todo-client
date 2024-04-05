import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects, todosReducer } from './shared/state';

import { SortButtonModule } from 'sort-button';

import { AppComponent } from './app.component';
import {
  LoaderComponent,
  ConfirmModalComponent,
  AddTodoComponent,
  ImportExportComponent,
  SearchTodosComponent,
  FilterTodosComponent,
  PagingComponent,
  TabsComponent,
  TodoItemComponent,
  TodoListComponent,
  TodoSettingsComponent,
  GeneralSettingsComponent,
  SearchSettingsComponent,
  PaginationSettingsComponent,
  SortingComponent,
  SortButtonComponent,
  SortIconComponent,
  ConfirmModalService
} from './components';

import {
  AlertService,
  LocalSettingsService,
  TodoService,
  LocalStorageProvider,
  StorageProviderKey,
  SettingsProviderKey
} from './shared/services';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TabsComponent,
    AddTodoComponent,
    SearchTodosComponent,
    FilterTodosComponent,
    ImportExportComponent,
    PagingComponent,
    SortingComponent,
    SortButtonComponent,
    SortIconComponent,
    ConfirmModalComponent,
    LoaderComponent,
    TodoSettingsComponent,
    GeneralSettingsComponent,
    SearchSettingsComponent,
    PaginationSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    SortButtonModule,
    PaginationModule.forRoot(),
    BsDropdownModule,
    FormsModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
