import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IState } from '../../../shared/state/state';
import { SortButtonComponent } from './sort-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortIconComponent } from '../sort-icon/sort-icon.component';
import { StorageProviderKey } from '../../../shared/services/storage.provider';
import { Store, StoreModule } from '@ngrx/store';
import { todosReducer } from '../../../shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../../../shared/state/todo.effects';
import { ISort, SortDirection } from '../../../shared/models/sort';
import { TodoListActions } from '../../../shared/state/todo.actions';
import { of } from 'rxjs';
import { todos } from '../../../tests/test-data';
import { SettingsProviderKey } from '../../../shared/services/settings.service';

describe('SortButtonComponent', () => {
  let component: SortButtonComponent;
  let fixture: ComponentFixture<SortButtonComponent>;
  let store: Store<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortButtonComponent, SortIconComponent],
      imports: [
        FontAwesomeModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ],
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
      ]
    });
    fixture = TestBed.createComponent(SortButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSort', () => {
    it('should sort Desc', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      component.sortDirection = sort.direction;
      component.column = sort.column;
      component.onSort();

      const action = TodoListActions.sort({
        sort: { column: 'title', direction: SortDirection.Desc } as ISort
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should sort Asc', () => {
      const sort = { column: 'title', direction: SortDirection.Desc } as ISort;
      component.sortDirection = sort.direction;
      component.column = sort.column;
      component.onSort();

      const action = TodoListActions.sort({
        sort: { column: 'title', direction: SortDirection.Asc } as ISort
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
