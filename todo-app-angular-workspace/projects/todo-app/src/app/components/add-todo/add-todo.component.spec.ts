import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';

import { StorageProviderKey, SettingsProviderKey } from '../../shared/services';
import { IState, TodoListActions, TodoEffects, todosReducer } from '../../shared/state';
import { AddTodoComponent } from './add-todo.component';
import { todos } from '../../tests/test-data';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTodoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        BsModalService,
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
      ],
      imports: [
        FormsModule,
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('add todo', () => {
    it('should add new todo', () => {
      const title = 'test title 1';
      const description = 'test description 1';
      component.title = title;
      component.description = description;
      component.onAdd();

      const action = TodoListActions.added({ title: title, description: description });
      expect(store.dispatch).toHaveBeenCalledWith(action);
      expect(component.title).toBe('');
      expect(component.description).toBe('');
    });

    it('should disable add button if title is empty', () => {
      component.title = '';
      component.description = 'desc';

      fixture.detectChanges();

      expect(component.ifDataIsMissing).toBeTrue();
    });

    it('should disable add button if description is empty', () => {
      component.title = 'title';
      component.description = '';

      fixture.detectChanges();

      expect(component.ifDataIsMissing).toBeTrue();
    });

    it('should enable add button if title and description are not empty', () => {
      component.title = 'title';
      component.description = 'desc';

      fixture.detectChanges();

      expect(component.ifDataIsMissing).toBeFalse();
    });
  });
});
