import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IState } from '../../shared/state/state';
import { TodoItemComponent } from './todo-item.component';
import { stateTestData } from '../../shared/test-data';
import { ITodo } from '../../shared/models/todo';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: MockStore<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      providers: [provideMockStore({ stateTestData } as any),]
    });
    store = TestBed.inject(MockStore);    
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
  });

  it('uncompleted todo should render 2 buttons', () => {
    const expectedTodo = {
      title: "test title",
      description: "test description",
      completed: false,
      createdAt: new Date(2023, 19, 10),
      id: 1
    } as ITodo;

    component.todo = expectedTodo;    
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.textContent?.trim()).toBe('Complete');
    expect(buttons[1]?.textContent?.trim()).toBe('Delete');
  });

  it('completed todo should render 1 button', () => {
    const expectedTodo = {
      title: "test title",
      description: "test description",
      completed: true,
      createdAt: new Date(2023, 19, 10),
      id: 1
    } as ITodo;
    
    component.todo = expectedTodo;    
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0]?.textContent?.trim()).toBe('Delete');
  });
});
