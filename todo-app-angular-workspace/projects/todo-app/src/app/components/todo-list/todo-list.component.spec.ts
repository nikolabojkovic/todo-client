import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ITodo } from '../../shared/models/todo';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { TodoService } from '../../shared/services/todo.service';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { TodoEffects } from '../../shared/state/todo.effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { TodoListComponent } from "./todo-list.component";
import { todos } from '../../tests/test-data';

describe("TodoListComponent", () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let store: Store<IState>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TodoService,
        {
          provide: StorageProviderKey,
          useValue: {
            getItem: (key: string) => of(JSON.stringify(todos))
          }
        }
      ],
      imports: [
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('ngOnInit', () => {
    it('should call dispatch with fetch', () => {
      component.ngOnInit();
      const action = TodoListActions.fetch();

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should select dipslay list', (done: DoneFn) => {
      component.ngOnInit();

      component.items$.subscribe((value: ITodo[]) => {

        const action = TodoListActions.fetch();
        expect(store.dispatch).toHaveBeenCalledWith(action);
        expect(value.length).toBe(5);
        done();
      });
    }, 100);

    it('should fetch with error', (done: DoneFn) => {
      spyOn(todoService, 'getList').and.returnValue(throwError(() => new Error(`Invalid data`)));
      component.ngOnInit();

      component.items$.subscribe((value: ITodo[]) => {
        const action = TodoListActions.fetch();
        expect(store.dispatch).toHaveBeenCalledWith(action);
        expect(value.length).toBe(0);
        done();
      });
    }, 100);
  });
})
