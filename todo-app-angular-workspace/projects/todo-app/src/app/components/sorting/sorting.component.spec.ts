import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SortAction, SortButtonComponent, SortIconComponent, SortingComponent } from '.';
import { IState, TodoEffects, TodoListActions, todosReducer } from '../../shared/state';
import { SettingsProviderKey, StorageProviderKey } from '../../shared/services';
import { todos } from '../../tests/test-data';
import { ISort, SortDirection } from '../../shared/models';

describe('SortingComponent', () => {
  let component: SortingComponent;
  let fixture: ComponentFixture<SortingComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SortingComponent, SortButtonComponent, SortIconComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    fixture = TestBed.createComponent(SortingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  describe('sort by title', () => {
    it('should sort by title Asc', () => {
      component.handleSort({ column: 'title', direction: SortDirection.Asc } as SortAction);

      const action = TodoListActions.sort({
        sort: { column: 'title', direction: SortDirection.Asc } as ISort
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
