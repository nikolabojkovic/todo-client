import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { stateTestData } from '../../tests/test-data';
import { IState } from '../../shared/state/state';

import { TabsComponent } from './tabs.component';
import { FormsModule } from '@angular/forms';
import { SearchTodosComponent } from '../search-todos/search-todos.component';
import { ImportExportComponent } from '../import-export/import-export.component';
import { MockLocalStorageProvider } from '../../tests/mocks/local-storage.provider.mock';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { TodoService } from '../../shared/services/todo.service';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let store: MockStore<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabsComponent,
        AddTodoComponent,
        SearchTodosComponent,
        SearchTodosComponent,
        ImportExportComponent
      ],
      imports: [FontAwesomeModule, FormsModule],
      providers: [
        provideMockStore({ stateTestData } as any),
        TodoService,
        {
          provide: StorageProviderKey,
          useClass: MockLocalStorageProvider
        },
      ]
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect tab change', () => {
    const funcSetTab = spyOn(component, 'setTab');
    const el = fixture.nativeElement.querySelectorAll('#tabs div');
    el[1].click();
    fixture.detectChanges();

    expect(funcSetTab).toHaveBeenCalled();
  });

  it('should change active tab', () => {
    component.setTab(component.tabs[1].name);
    fixture.detectChanges();

    expect(component.active).toBe(component.tabs[1].name);
  });

  it('should switch to search tab', () => {
    const el = fixture.nativeElement.querySelectorAll('#tabs div');
    el[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const searchTabEl = fixture.nativeElement.querySelector('app-search-todos');
    expect(searchTabEl).toBeTruthy();
  });
});
