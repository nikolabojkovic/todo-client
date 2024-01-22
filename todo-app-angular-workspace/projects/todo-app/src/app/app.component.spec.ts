import { TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { stateTestData } from './tests/test-data';
import { IState } from './shared/state/state';
import { PagingComponent } from './components/paging/paging.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { FormsModule } from '@angular/forms';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { MockLocalStorageProvider } from './tests/mocks/local-storage.provider.mock';
import { StorageProviderKey } from './shared/services/storage.provider';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let store: MockStore<IState>;

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
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FontAwesomeModule, 
        PaginationModule.forRoot(), 
        FormsModule, 
        BsDropdownModule
      ],
      providers: [
        provideMockStore({ stateTestData } as any),  
        {
          provide: StorageProviderKey,
          useClass: MockLocalStorageProvider
        },
      ]
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
