import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IState } from '../../shared/state/state';
import { SortButtonComponent } from './sort-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortIconComponent } from '../sort-icon/sort-icon.component';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { Store, StoreModule } from '@ngrx/store';
import { todosReducer } from '../../shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../../shared/state/todo.effects';
import { ISort, SortDirection } from '../../shared/models/sort';
import { IFilter } from '../../shared/models/filter';
import { TodoListActions } from '../../shared/state/todo.actions';
import { of } from 'rxjs';
import { todos } from '../../tests/test-data';

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
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = '';
      component.search = searchTerm;
      component.sortDirection = sort.direction;
      component.column = sort.column;
      component.filter = filter;
      component.onSort();

      const action = TodoListActions.sort({
        filter,
        sort: { column: 'title', direction: SortDirection.Desc } as ISort,
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should sort Asc', () => {
      const sort = { column: 'title', direction: SortDirection.Desc } as ISort;
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = '';
      component.search = searchTerm;
      component.sortDirection = sort.direction;
      component.column = sort.column;
      component.filter = filter;
      component.onSort();

      const action = TodoListActions.sort({
        filter,
        sort: { column: 'title', direction: SortDirection.Asc } as ISort,
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
