import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortButtonModule } from 'sort-button';
import { todosReducer } from './state/todo.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { SearchTodosComponent } from './components/search-todos/search-todos.component';
import { FormsModule } from '@angular/forms';
import { FilterTodosComponent } from './components/filter-todos/filter-todos.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { TodoService } from './shared/services/todo.service';
import { PagingComponent } from './components/paging/paging.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { TodoEffects } from './state/todo.effects';


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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    SortButtonModule,
    PaginationModule.forRoot(),
    FormsModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
