import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationSettingsComponent } from './pagination-settings.component';
import { Store, StoreModule } from '@ngrx/store';
import { IState } from '../../../shared/state/state';
import { TodoService } from '../../../shared/services/todo.service';
import { todos } from '../../../tests/test-data';
import { of } from 'rxjs';
import { StorageProviderKey } from '../../../shared/services/storage.provider';
import { SettingsProviderKey } from '../../../shared/services/settings.service';
import { todosReducer } from '../../../shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../../../shared/state/todo.effects';

describe('PaginationSettingsComponent', () => {
  let component: PaginationSettingsComponent;
  let fixture: ComponentFixture<PaginationSettingsComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationSettingsComponent],
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
    fixture = TestBed.createComponent(PaginationSettingsComponent);
    component = fixture.componentInstance;
    spyOn(store, 'dispatch').and.callFake(() => {});
    fixture.detectChanges();
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(component).toBeTruthy();
    });
  });
});
