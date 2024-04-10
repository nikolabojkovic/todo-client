import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { of } from 'rxjs';

import { TodoSettingsComponent } from './todo-settings.component';
import { TodoService, StorageProviderKey, SettingsProviderKey } from '../../shared/services';
import { todos } from '../../tests/test-data';
import { IState, TodoEffects, todosReducer } from '../../shared/state';

describe('TodoSettingsComponent', () => {
  let component: TodoSettingsComponent;
  let fixture: ComponentFixture<TodoSettingsComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      ],
      imports: [
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TodoSettingsComponent);
    component = fixture.componentInstance;
    spyOn(store, 'dispatch').and.callFake(() => {});
    fixture.detectChanges();
  });

  describe('component ', () => {
    it('should exist', () => {
      expect(component).toBeTruthy();
    });
  });
});
