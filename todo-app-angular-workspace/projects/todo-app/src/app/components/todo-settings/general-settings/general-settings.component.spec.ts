import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { GeneralSettingsComponent } from './general-settings.component';

import { IState, todosReducer, TodoEffects } from '../../../shared/state';
import { todos } from '../../../tests/test-data';
import { TodoService, StorageProviderKey, SettingsProviderKey } from '../../../shared/services';

describe('GeneralSettingsComponent', () => {
  let component: GeneralSettingsComponent;
  let fixture: ComponentFixture<GeneralSettingsComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
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
    }).compileComponents();
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(GeneralSettingsComponent);
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
