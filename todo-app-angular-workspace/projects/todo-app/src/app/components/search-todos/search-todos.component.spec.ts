import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from '@angular/forms';
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
import { SearchTodosComponent } from "./search-todos.component";

describe("SearchTodosComponent", () => {
  let component: SearchTodosComponent;
  let fixture: ComponentFixture<SearchTodosComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchTodosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: StorageProviderKey,
        useClass: MockLocalStorageProvider
      }],
      imports: [
        FormsModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTodosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('onTyping', () => {
    it('should update search term and do search', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = '';
      component.searchValue = searchTerm;
      component.sort = sort;
      component.filter = filter;
      component.onTyping();

      const actionSearchterm = TodoListActions.searchTermUpdated({
        searchTerm: searchTerm
      });
      const actionSearch = TodoListActions.search({
        filter,
        sort,
        search: searchTerm
      });
      expect(store.dispatch).toHaveBeenCalledWith(actionSearchterm);
      expect(store.dispatch).toHaveBeenCalledWith(actionSearch);
    });

    it('should only update search term', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.sort = sort;
      component.filter = filter;
      component.onTyping();

      const actionSearchterm = TodoListActions.searchTermUpdated({
        searchTerm: searchTerm
      });
      const actionSearch = TodoListActions.search({
        filter,
        sort,
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(actionSearchterm);
      expect(store.dispatch).not.toHaveBeenCalledWith(actionSearch);
    });
  });

  describe('onSearch', () => {
    it('should search', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.sort = sort;
      component.filter = filter;
      component.onSerach();

      const actionSearch = TodoListActions.search({
        filter,
        sort,
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(actionSearch);
    });
  });

  describe('onClearSearch', () => {
    it('should clear search value and do search', () => {
      const sort = { column: 'title', direction: SortDirection.Asc } as ISort;
      const filter = { completed: false, uncompleted: false } as IFilter;
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.sort = sort;
      component.filter = filter;
      component.onClearSearch();

      const actionSearch = TodoListActions.search({
        filter,
        sort,
        search: ''
      });

      expect(component.searchValue).toBe('');
      expect(store.dispatch).toHaveBeenCalledWith(actionSearch);
    });
  });
})
