import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { stateTestData } from '../../shared/test-data';
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
      providers: [provideMockStore({ stateTestData } as any),]
    });
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
