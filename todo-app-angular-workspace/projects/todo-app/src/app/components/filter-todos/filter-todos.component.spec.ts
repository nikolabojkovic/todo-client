import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { IFilter, StateFilter } from '../../shared/models/filter';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { TodoEffects } from '../../shared/state/todo.effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { FilterTodosComponent } from './filter-todos.component';
import { of } from 'rxjs';
import { todos } from '../../tests/test-data';
import { SettingsProviderKey } from '../../shared/services/settings.service';

describe('FilterTodosComponent', () => {
  let component: FilterTodosComponent;
  let fixture: ComponentFixture<FilterTodosComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterTodosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
      ],
      imports: [
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTodosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('onFilter', () => {
    it('should dispatch filter action completed', () => {
      const filter = { state: StateFilter.completed } as IFilter;
      component.stateFilter = filter.state;

      const action = TodoListActions.filter({
        filter
      });
      component.onFilter(StateFilter.completed);

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch filter action uncompleted', () => {
      const filter = { state: StateFilter.uncompleted } as IFilter;
      component.stateFilter = filter.state;

      const action = TodoListActions.filter({
        filter
      });
      component.onFilter(StateFilter.uncompleted);

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

  });
});
