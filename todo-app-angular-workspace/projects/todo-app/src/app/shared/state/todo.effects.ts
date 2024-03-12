import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, first, map, tap } from 'rxjs/operators';
import { ITodo } from '../models/todo';
import { IState } from './state';
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
      exhaustMap(() => this.todoService.getList(
        {} as IFilter,
        {
          column: 'createdAt',
          direction: 'asc'
        } as ISort)
        .pipe(
          first(),
          map((list: ITodo[]) => TodoListActions.fetched({ list })),
          catchError((err) => {
            // console.error("error catched in effect: " + err);
            return of(TodoListActions.fetched({ list: [] as ITodo[] }));
          })
        )
      )
    )
  );

  searchTodoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.search),
      exhaustMap((action: any) =>
        this.todoService.getList(
          action.filter,
          action.sort,
          action.search)
          .pipe(
            first(),
            map((list: ITodo[]) =>
              TodoListActions.searched({
                searchTerm: action.search,
                activePage: 1,
                list: list
              })
            )
          )
      )
    )
  );

  filterTodoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.filter),
      exhaustMap((action: any) =>
        this.todoService.getList(
          action.filter,
          action.sort,
          action.search)
          .pipe(
            first(),
            map((list: ITodo[]) =>
              TodoListActions.filtered({
                activePage: 1,
                filter: action.filter,
                list: list
              })
            )
          )
      )
    )
  );

  sortTodoList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TodoListActions.sort),
    exhaustMap((action: any) =>
      this.todoService.getList(
        action.filter,
        action.sort,
        action.search)
        .pipe(
          first(),
          map((list: ITodo[]) =>
            TodoListActions.sorted({
              sort: action.sort,
              list: list
            })
          )
        )
    )
  )
);

  startLoader$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoListActions.fetch,
        TodoListActions.search,
        TodoListActions.filter,
        TodoListActions.sort
      ),
      map(() =>
        TodoListActions.loadingStarted()
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store<IState>
  ) {}
}
