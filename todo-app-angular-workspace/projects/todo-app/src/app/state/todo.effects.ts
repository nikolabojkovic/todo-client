import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
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

  loadTodoList$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TodoListActions.fetch),
      exhaustMap(() => this.todoService.getTodoList()
        .pipe(
          map((todoList: ITodoList) => TodoListActions.fetched({ todoList })),
          catchError(() => of(TodoListActions.fetched( { todoList: { } as ITodoList })))
        )
      )
    )
  );
 
  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store<ITodoList>
  ) {}
}
