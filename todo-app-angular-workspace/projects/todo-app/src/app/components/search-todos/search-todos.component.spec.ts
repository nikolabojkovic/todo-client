import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { TodoEffects } from '../../shared/state/todo.effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { SearchTodosComponent } from './search-todos.component';
import { of } from 'rxjs';
import { todos } from '../../tests/test-data';
import { SettingsProviderKey } from '../../shared/services/settings.service';
import { TodoService } from '../../shared/services/todo.service';

describe('SearchTodosComponent', () => {
  let component: SearchTodosComponent;
  let fixture: ComponentFixture<SearchTodosComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchTodosComponent],
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
      const searchTerm = '';
      component.searchValue = searchTerm;

      component.onTyping();

      const searchTermAction = TodoListActions.searchTermUpdated({
        searchTerm: searchTerm
      });
      const searchAction = TodoListActions.search({
        search: searchTerm
      });
      expect(store.dispatch).toHaveBeenCalledWith(searchTermAction);
      expect(store.dispatch).toHaveBeenCalledWith(searchAction);
    });

    it('should only update search term', () => {
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.onTyping();

      const searchTermAction = TodoListActions.searchTermUpdated({
        searchTerm: searchTerm
      });
      const searchAction = TodoListActions.search({
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(searchTermAction);
      expect(store.dispatch).not.toHaveBeenCalledWith(searchAction);
    });
  });

  describe('onSearch', () => {
    it('should search', () => {
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.onSerach();

      const searchAction = TodoListActions.search({
        search: searchTerm
      });

      expect(store.dispatch).toHaveBeenCalledWith(searchAction);
    });
  });

  describe('onClearSearch', () => {
    it('should clear search value and do search', () => {
      const searchTerm = 'test';
      component.searchValue = searchTerm;
      component.onClearSearch();

      const searchAction = TodoListActions.search({
        search: ''
      });

      expect(component.searchValue).toBe('');
      expect(store.dispatch).toHaveBeenCalledWith(searchAction);
    });
  });
});
