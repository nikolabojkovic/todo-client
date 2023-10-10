import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ITodoList } from '../../shared/models/todoList';
import { TodoItemComponent } from './todo-item.component';
import { inMemoryTodoListTestData } from '../../shared/test-data';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: MockStore<ITodoList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      providers: [provideMockStore({ inMemoryTodoListTestData } as any),]
    });
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create todo list', () => {
    expect(component).toBeTruthy();
  });
});
