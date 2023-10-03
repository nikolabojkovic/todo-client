import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ITodoList } from '../shared/models/todoList';
import { TodoService } from '../shared/services/todo.service';
import { TodoListActions } from './todo.actions';
import { selectTodos } from './todo.selectors';
 
@Injectable()
export class TodoEffects {
 
    updateTodoList$ = createEffect(() => this.actions$.pipe(
      ofType(
        TodoListActions.added, 
        TodoListActions.completed,
        TodoListActions.removed,
        TodoListActions.imported),
      concatLatestFrom(action => this.store.select(selectTodos)),
        tap(([action, todoList]) => this.todoService.saveTodos(todoList))
      ),
      { dispatch: false }
    );
 
  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store<ITodoList>
  ) {}
}
