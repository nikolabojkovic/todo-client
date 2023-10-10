import { TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { inMemoryTodoListTestData } from './shared/test-data';
import { ITodoList } from './shared/models/todoList';
import { PagingComponent } from './components/paging/paging.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { FormsModule } from '@angular/forms';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';

describe('AppComponent', () => {
  let store: MockStore<ITodoList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, 
        TabsComponent,
        SortButtonComponent,
        SortIconComponent,
        SortingComponent, 
        TodoListComponent, 
        PagingComponent, 
        AddTodoComponent],
      imports: [FontAwesomeModule, PaginationModule.forRoot(), FormsModule],
      providers: [provideMockStore({ inMemoryTodoListTestData } as any),]
    });
    store = TestBed.inject(MockStore);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'todo-client-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('todo-client-angular');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('Todo List');
  });
});
