import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { of } from 'rxjs';

import { SortButtonModule } from 'sort-button';

import { todos } from '../../tests/test-data';
import { PagingComponent } from './paging.component';
import { IState, todosReducer, TodoEffects, TodoListActions } from '../../shared/state';
import { StorageProviderKey, SettingsProviderKey } from '../../shared/services';

describe('PagingComponent', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;
  let store: Store<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagingComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        PaginationModule.forRoot(),
        FormsModule,
        BsDropdownModule,
        SortButtonModule,
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
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should change page on pageChange', () => {
    component.activePage = 3;
    component.itemsPerPage = 10;
    component.onPageClick();

    const action = TodoListActions.pagingUpdated({
      activePage: 3,
      itemsPerPage: 10
    });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should change page size on pageSizeChange', () => {
    component.activePage = 1;
    component.itemsPerPage = 10;
    component.onPageSizeChange(50);

    const action = TodoListActions.pagingUpdated({
      activePage: 1,
      itemsPerPage: 50
    });
    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(component.itemsPerPage).toBe(50);
  });
});
