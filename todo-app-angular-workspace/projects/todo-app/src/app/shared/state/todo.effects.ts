import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, first, map, tap, combineLatestWith } from 'rxjs/operators';
import { ITodo } from '../models/todo';
import { IState, State as TodoState } from './state';
import { TodoService } from '../services/todo.service';
import { TodoListActions } from './todo.actions';
import { selectPaging, selectSettings, selectTodos } from './todo.selectors';
import { IFilter } from '../models/filter';
import { ISort } from '../models/sort';
import { ISettingsService, SettingsProviderKey } from '../services/settings.service';
import { ISettings } from '../models/settings';
import { IStorageProvider, StorageProviderKey } from '../services/storage.provider';
import { IPaging } from '../models/paging';

@Injectable()
export class TodoEffects {

  saveTodoList$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoListActions.added,
      TodoListActions.completed,
      TodoListActions.removed,
      TodoListActions.imported),
    concatLatestFrom(() => this.store.select(selectTodos).pipe(first())),
      tap(([, todoList]) => this.todoService.saveList(todoList.originalList).pipe(first()))
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
          catchError(() => {
            return of(TodoListActions.fetched({ list: [] as ITodo[] }));
          })
        )
      )
    )
  );

  searchTodoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.search),
      exhaustMap((action) =>
        this.todoService.getList(
          action.filter,
          action.sort,
          action.search)
          .pipe(
            first(),
            map((list: ITodo[]) =>
              TodoListActions.searched({
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
      exhaustMap((action) =>
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
    exhaustMap((action) =>
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

  saveSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoListActions.settingsUpdated
      ),
      concatLatestFrom(() => this.store.select(selectSettings).pipe(first())),
        tap(([, settings]) => this.settingsService.saveSettings(settings).pipe(first()))
      ),
      { dispatch: false }
  );

  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.settingsFetch),
      exhaustMap(() =>
        this.settingsService.loadSettings()
          .pipe(
            first(),
            map((settings: ISettings) => TodoListActions.settingsFetched({ payload: settings })),
            catchError(() => {
              return of(TodoListActions.settingsFetched({ payload: new TodoState([]).settings }));
            })
          )
      )
    )
  );

  savePaging$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoListActions.pagingUpdated,
        TodoListActions.added,
        TodoListActions.removed
      ),
      concatLatestFrom(() => this.store.select(selectPaging).pipe(first())),
        tap(([, paging]) => this.storageProvider.setItem('todo-paging', paging).pipe(first()))
      ),
      { dispatch: false }
  );

  loadPaging$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.pagingFetch),
      combineLatestWith(this.store.select(selectPaging).pipe(first())),
      exhaustMap(([, paging]: [unknown, IPaging]) =>
        this.storageProvider.getItem('todo-paging')
          .pipe(
            first(),
            map((pagingData: string | null | undefined) => TodoListActions.pagingFetched({ paging: pagingData ? JSON.parse(pagingData) : paging})),
            catchError(() => {
              return of(TodoListActions.settingsFetched({ payload: new TodoState([]).settings }));
            })
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    @Inject(SettingsProviderKey) private settingsService: ISettingsService,
    @Inject(StorageProviderKey) private storageProvider: IStorageProvider,
    private store: Store<IState>
  ) {}
}


