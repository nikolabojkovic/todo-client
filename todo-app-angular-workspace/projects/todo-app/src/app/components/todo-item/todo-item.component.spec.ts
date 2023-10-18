import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IState } from '../../shared/state/state';
import { TodoItemComponent } from './todo-item.component';
import { inMemoryTodoListTestState } from '../../shared/test-data';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: MockStore<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      providers: [provideMockStore({ inMemoryTodoListTestState } as any),]
    });
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create todo list', () => {
    expect(component).toBeTruthy();
  });
});
