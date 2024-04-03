import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSettingsComponent } from './search-settings.component';
import { TodoService } from '../../../shared/services/todo.service';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { todosReducer } from '../../../shared/state/todo.reducer';
import { TodoEffects } from '../../../shared/state/todo.effects';
import { SettingsProviderKey } from '../../../shared/services/settings.service';
import { of } from 'rxjs';
import { todos } from '../../../tests/test-data';
import { StorageProviderKey } from '../../../shared/services/storage.provider';
import { IState } from '../../../shared/state/state';

describe('SearchSettingsComponent', () => {
  let component: SearchSettingsComponent;
  let fixture: ComponentFixture<SearchSettingsComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchSettingsComponent],
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
    fixture = TestBed.createComponent(SearchSettingsComponent);
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
