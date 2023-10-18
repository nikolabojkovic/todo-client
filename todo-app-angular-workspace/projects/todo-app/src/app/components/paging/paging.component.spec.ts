import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { inMemoryTodoListTestState } from '../../shared/test-data';
import { PagingComponent } from './paging.component';
import { IState } from '../../shared/state/state';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

describe('PagingComponent', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;
  let store: MockStore<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagingComponent],
      imports: [FontAwesomeModule, PaginationModule.forRoot(), FormsModule],
      providers: [provideMockStore({ inMemoryTodoListTestData: inMemoryTodoListTestState } as any),]
    });
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
