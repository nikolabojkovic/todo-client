import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { inMemoryTodoListTestData } from '../../shared/test-data';
import { ITodoList } from '../../shared/models/todoList';
import { SortButtonComponent } from './sort-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortIconComponent } from '../sort-icon/sort-icon.component';

describe('SortButtonComponent', () => {
  let component: SortButtonComponent;
  let fixture: ComponentFixture<SortButtonComponent>;
  let store: MockStore<ITodoList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortButtonComponent, SortIconComponent],
      imports: [FontAwesomeModule],
      providers: [provideMockStore({ inMemoryTodoListTestData } as any),]
    });
    fixture = TestBed.createComponent(SortButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
