import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { of } from 'rxjs';

import { todos } from '../../tests/test-data';

import { TabsComponent } from './tabs.component';
import { FormsModule } from '@angular/forms';
import { SearchTodosComponent } from '../search-todos/search-todos.component';
import { ImportExportComponent } from '../import-export/import-export.component';
import { StorageProviderKey } from '../../shared/services/storage.provider';

import { TodoService } from '../../shared/services/todo.service';
import { SettingsProviderKey } from '../../shared/services/settings.service';
import { StoreModule } from '@ngrx/store';
import { todosReducer } from '../../shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../../shared/state/todo.effects';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabsComponent,
        AddTodoComponent,
        SearchTodosComponent,
        SearchTodosComponent,
        ImportExportComponent
      ],
      imports: [
        FontAwesomeModule,
        FormsModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getList: () => of(todos),
            saveList: () => of({})
          }
        },
        {
          provide: StorageProviderKey,
          useValue: {
            getItem: () => of(JSON.stringify(todos))
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
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
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
