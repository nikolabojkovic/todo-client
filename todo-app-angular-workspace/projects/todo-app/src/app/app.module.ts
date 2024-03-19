import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SortButtonModule } from 'sort-button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { SearchTodosComponent } from './components/search-todos/search-todos.component';
import { FilterTodosComponent } from './components/filter-todos/filter-todos.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { PagingComponent } from './components/paging/paging.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { LoaderComponent } from './components/loader/loader.component';

import { BsModalService } from 'ngx-bootstrap/modal';

import { TodoEffects } from './shared/state/todo.effects';
import { todosReducer } from './shared/state/todo.reducer';

import { LocalStorageProvider, StorageProviderKey } from './shared/services/storage.provider';

import { AlertService } from './shared/services/alert.service';
import { TodoService } from './shared/services/todo.service';
import { ConfirmModalService } from './components/confirm-modal/confirm-modal.service';


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
    TodoService,
    ConfirmModalService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
