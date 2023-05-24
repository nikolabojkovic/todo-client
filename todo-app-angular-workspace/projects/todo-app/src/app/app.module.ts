import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortButtonModule } from 'sort-button';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TabsComponent } from './tabs/tabs.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { SearchTodosComponent } from './search-todos/search-todos.component';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TabsComponent,
    AddTodoComponent,
    SearchTodosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    SortButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
