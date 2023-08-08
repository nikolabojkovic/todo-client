import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortButtonModule } from 'sort-button';
import { todosReducer } from './state/todos.reducer';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TabsComponent } from './tabs/tabs.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { SearchTodosComponent } from './search-todos/search-todos.component';
import { FormsModule } from '@angular/forms';
import { FilterTodosComponent } from './filter-todos/filter-todos.component';
import { ImportExportComponent } from './import-export/import-export.component';
import { TodoService } from './shared/services/todo.service';
import { PagingComponent } from './paging/paging.component';


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
    PagingComponent
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
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
