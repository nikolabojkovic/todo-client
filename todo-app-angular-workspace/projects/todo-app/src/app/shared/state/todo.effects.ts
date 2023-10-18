import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, first, map, tap } from 'rxjs/operators';
import { ITodo } from '../models/todo';
import { IState, State } from './state';
import { TodoService } from '../services/todo.service';
import { TodoListActions } from './todo.actions';
import { selectTodos } from './todo.selectors';
import { IFilter } from '../models/filter';
import { ISort } from '../models/sort';
 
@Injectable()
export class TodoEffects {
 
  updateTodoList$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoListActions.added, 
      TodoListActions.completed,
      TodoListActions.removed,
      TodoListActions.imported),
    concatLatestFrom(action => this.store.select(selectTodos)),
      tap(([action, todoList]) => this.todoService.saveList(todoList.originalList))
    ),
    { dispatch: false }
  );

  loadTodoList$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TodoListActions.fetch),
      exhaustMap(() => this.todoService.getList({} as IFilter, 
        {
          column: 'createdAt',
          direction: 'asc'
        } as ISort)
        .pipe(
          first(),
          map((list: ITodo[]) => TodoListActions.fetched({ list })),
          catchError((err) => { 
            // console.error("error catched in effect: " + err);
            return of(TodoListActions.fetched( { list: [] as ITodo[] })); 
          })
        )
      )
    )
  );
 
  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store<IState>
  ) {}
}
