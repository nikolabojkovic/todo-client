import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IState } from '../../shared/state/state';
import { TodoItemComponent } from './todo-item.component';
import { ITodo } from '../../shared/models/todo';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { todosReducer } from '../../shared/state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../../shared/state/todo.effects';
import { TodoListActions } from '../../shared/state/todo.actions';
import { todos } from '../../tests/test-data';
import { TodoService } from '../../shared/services/todo.service';
import { SettingsProviderKey } from '../../shared/services/settings.service';
import { StorageProviderKey } from '../../shared/services/storage.provider';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: Store<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      imports: [
        FontAwesomeModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ],
      providers: [
        ConfirmModalService,
        BsModalService,
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
      ]
    });
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(TestBed.inject(ConfirmModalService), 'confirm').and.returnValue(of(true));
    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  describe('component render', () => {
    it('uncompleted todo should render 2 icons', () => {
      const expectedTodo = {
        title: 'test title',
        description: 'test description',
        completed: false,
        createdAt: new Date(2023, 19, 10),
        id: 1
      } as ITodo;

      component.todo = expectedTodo;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const icons = compiled.querySelectorAll('.ng-fa-icon');
      expect(icons.length).toBe(2);
    });

    it('completed todo should render complete icon disabled', () => {
      const expectedTodo = {
        title: 'test title',
        description: 'test description',
        completed: true,
        createdAt: new Date(2023, 19, 10),
        id: 1
      } as ITodo;

      component.todo = expectedTodo;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const icons = compiled.querySelectorAll('.ng-fa-icon');
      expect(icons[0]?.className).toContain('action-icon--disabled');
    });
  });

  describe('component behavours', () => {
    it('not completed todo onComplete should complete todo', () => {
      const expectedTodo = {
        title: 'test title',
        description: 'test description',
        completed: false,
        createdAt: new Date(2023, 19, 10),
        id: 1
      } as ITodo;

      component.todo = expectedTodo;
      component.onComplete();

      const action = TodoListActions.completed({ todoId: expectedTodo.id });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('completed todo onComplete should not complete todo', () => {
      const expectedTodo = {
        title: 'test title',
        description: 'test description',
        completed: true,
        createdAt: new Date(2023, 19, 10),
        id: 1
      } as ITodo;

      component.todo = expectedTodo;
      component.onComplete();

      const action = TodoListActions.completed({ todoId: expectedTodo.id });
      expect(store.dispatch).not.toHaveBeenCalledWith(action);
    });
    it('onRemove should remove todo', () => {
      const expectedTodo = {
        title: 'test title',
        description: 'test description',
        completed: false,
        createdAt: new Date(2023, 19, 10),
        id: 1
      } as ITodo;

      component.todo = expectedTodo;
      component.onRemove();

      const action = TodoListActions.removed({ todoId: expectedTodo.id });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
