import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { IFilter } from '../../shared/models/filter';
import { ISort, SortDirection } from '../../shared/models/sort';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { TodoEffects } from '../../shared/state/todo.effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { MockLocalStorageProvider } from '../../tests/mocks/local-storage.provider.mock';
import { FilterTodosComponent } from "./filter-todos.component";

describe("FilterTodosComponent", () => {
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
          useClass: MockLocalStorageProvider
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
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: true, uncompleted: false } as IFilter;
      const searchTerm = '';
      component.search = searchTerm;
      component.sort = sort;
      component.isCompleted = filter.completed
      component.isUncompleted = filter.uncompleted;

      const action = TodoListActions.filter({
        filter,
        sort,
        search: searchTerm
      });
      component.onFilter();

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch filter action uncompleted', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: false, uncompleted: true } as IFilter;
      const searchTerm = '';
      component.search = searchTerm;
      component.sort = sort;
      component.isCompleted = filter.completed
      component.isUncompleted = filter.uncompleted;

      const action = TodoListActions.filter({
        filter,
        sort,
        search: searchTerm
      });
      component.onFilter();

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

  });
})
