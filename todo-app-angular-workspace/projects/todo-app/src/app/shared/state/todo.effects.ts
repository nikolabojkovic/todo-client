import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, exhaustMap, filter, first, map, switchMap, tap } from 'rxjs/operators';

import {
  ITodo,
  ISettings,
  IFilter,
  ISort,
  SortDirection
} from '../models';
import {
  IState,
  State as TodoState,
  TodoListActions,
  selectPaging,
  selectTodos,
  selectSort
} from './';
import {
  TodoService,
  ISettingsService,
  SettingsProviderKey,
  IStorageProvider,
  StorageProviderKey
} from '../services';

@Injectable()
export class TodoEffects {

  loadTodoList$ = createEffect(() => {
    let sort = {
      column: 'sortId',
      direction: SortDirection.Asc
    } as ISort;
    return this.actions$.pipe(
      ofType(TodoListActions.fetch),
      switchMap(() => this.storageProvider.getItem('todo-sort')),
      exhaustMap((localStorageSort: string | null | undefined) => {
        if (localStorageSort) {
          sort = JSON.parse(localStorageSort) as ISort;
        }

        return this.todoService.getList(
          {} as IFilter,
          sort
          )
          .pipe(
            first(),
            map((list: ITodo[]) => TodoListActions.fetched({ list, sort })),
            catchError(() => {
              return of(TodoListActions.fetched({ list: [] as ITodo[], sort }));
            })
          );
      })
    );
  });

  searchTodoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.search),
      concatLatestFrom(() => this.store.select(selectTodos).pipe(first())),
      exhaustMap(([action, state]) => this.todoService.getList(
        state.filter,
        state.sort,
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
      concatLatestFrom(() => this.store.select(selectTodos).pipe(first())),
      exhaustMap(([action, state]) => this.todoService.getList(
          action.filter,
          state.sort,
          state.search.searchTerm)
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
      concatLatestFrom(() => this.store.select(selectTodos).pipe(first())),
      exhaustMap(([action, state]) => this.todoService.getList(
          state.filter,
          action.sort,
          state.search.searchTerm)
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

  saveTodoList$ = createEffect(() => this.actions$
    .pipe(
      ofType(
        TodoListActions.added,
        TodoListActions.completed,
        TodoListActions.removed,
        TodoListActions.imported,
        TodoListActions.manuallySorted,
        TodoListActions.restoredAll,
        TodoListActions.removedAll),
      concatLatestFrom(() => this.store.select(selectTodos).pipe(first())),
      tap(([, todoList]) => this.todoService.saveList(todoList.originalList).pipe(first()))
    ),
    { dispatch: false }
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

  saveSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.settingsUpdated),
      exhaustMap((action) => this.settingsService.saveSettings(action.payload).pipe(first()))
    ),
    { dispatch: false }
  );


  loadPaging$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoListActions.pagingFetch),
      exhaustMap(() =>
        this.storageProvider.getItem('todo-paging')
          .pipe(
            first(),
            filter(data => !!data),
            map((pagingData: string | null | undefined) => TodoListActions.pagingFetched({ paging: JSON.parse(pagingData!)})),
            catchError(() => {
              return EMPTY;
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

  saveSorting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoListActions.sorted,
        TodoListActions.manuallySorted
      ),
      concatLatestFrom(() => this.store.select(selectSort).pipe(first())),
        tap(([, sort]) => this.storageProvider.setItem('todo-sort', sort).pipe(first()))
      ),
      { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    @Inject(SettingsProviderKey) private settingsService: ISettingsService,
    @Inject(StorageProviderKey) private storageProvider: IStorageProvider,
    private store: Store<IState>
  ) {}
}


