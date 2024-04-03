import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { stateTestData, todos } from './tests/test-data';
import { PagingComponent } from './components/paging/paging.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { FormsModule } from '@angular/forms';
import { SortButtonComponent } from './components/sorting/sort-button/sort-button.component';
import { SortIconComponent } from './components/sorting/sort-icon/sort-icon.component';
import { StorageProviderKey } from './shared/services/storage.provider';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { TodoListActions } from './shared/state/todo.actions';
import { Store, StoreModule } from '@ngrx/store';
import { todosReducer } from './shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './shared/state/todo.effects';
import { SettingsProviderKey } from './shared/services/settings.service';
import { IState } from './shared/state/state';
import { TodoService } from './shared/services/todo.service';

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
