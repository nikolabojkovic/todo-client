import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AppComponent } from './app.component';
import { SortButtonComponent } from './components/sorting/sort-button/sort-button.component';
import {
  SortingComponent,
  TabsComponent,
  TodoListComponent,
  PagingComponent,
  AddTodoComponent,
  SortIconComponent
} from './components';
import { stateTestData, todos } from './tests/test-data';
import { TodoService, StorageProviderKey, SettingsProviderKey } from './shared/services';
import { IState, TodoListActions, TodoEffects, todosReducer } from './shared/state';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store<IState>;
  let todoService: TodoService;

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
        BsDropdownModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ],
      providers: [
        provideMockStore({ stateTestData } as never),
        {
          provide: StorageProviderKey,
          useValue: {
            getItem: () => of(JSON.stringify(todos)),
            setItem: () => of({})
          }
        },
        {
          provide: SettingsProviderKey,
          useValue: {
            loadSettings: () => of({}),
            saveSettings: () => of({})
          }
        }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have as title \'todo-client-angular\'', () => {
    expect(component.title).toEqual('todo-client-angular');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('Todo List');
  });

  it('should call dispatch with fetch', () => {
    component.ngOnInit();
    const action = TodoListActions.fetch();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should fetch with error', () => {
    spyOn(todoService, 'getList').and.returnValue(throwError(() => new Error('Invalid data')));
    component.ngOnInit();
    const action = TodoListActions.fetch();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
