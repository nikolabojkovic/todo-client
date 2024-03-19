import { ComponentFixture, TestBed } from '@angular/core/testing';
import { todos } from '../../tests/test-data';
import { PagingComponent } from './paging.component';
import { IState } from '../../shared/state/state';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SortButtonModule } from 'sort-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { TodoEffects } from '../../shared/state/todo.effects';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { TodoListActions } from '../../shared/state/todo.actions';
import { of } from 'rxjs';

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
      providers: [{
        provide: StorageProviderKey,
        useValue: {
          getItem: () => of(JSON.stringify(todos)),
          setItem: () => of({})
        }
      }]
    });
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should change page on pageChange', () => {
    component.activePage = 1;
    component.itemsPerPage = 10;
    component.onPageChange({page: 3} as PageChangedEvent);

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
