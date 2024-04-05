import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription, concatMap, debounceTime, filter, first, tap } from 'rxjs';

import { ISettings, ISearch } from '../../shared/models';
import { IState, TodoListActions, selectSearch, selectSettings } from '../../shared/state';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit, OnDestroy {
  ifSearchIsEmpty = true;
  searchValue = '';
  settings!: ISettings;
  faCircleXmark = faCircleXmark;
  private searchOnKeyup$ = new Subject<string>();
  private subscription!: Subscription;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.store.select(selectSearch)
      .pipe(
        first()
      )
      .subscribe((search: ISearch) => {
        this.searchValue = search.searchTerm;
        this.ifSearchIsEmpty = search.searchTerm === '';
      });

    this.subscription = this.store.select(selectSettings)
      .pipe(
        first(),
        tap((settings: ISettings) => this.settings = settings),
        filter((settings: ISettings) => settings.search.isSearchOnKeyPressEnabled),
        concatMap((settings: ISettings) => this.searchOnKeyup$
          .pipe(
            filter((value: string) => !!value),
            debounceTime(settings.search.debounceTime),
          )),
      )
      .subscribe(() => this.onSerach());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onTyping(): void {
    this.ifSearchIsEmpty = !this.searchValue || this.searchValue.trim() === '';
    this.store.dispatch(TodoListActions.searchTermUpdated({
      searchTerm: this.searchValue ? this.searchValue.trim() : ''
    }));

    if (this.searchValue.trim() === '') {
      this.onSerach();
    }

    if (this.settings.search.isSearchOnKeyPressEnabled) {
      this.searchOnKeyup$.next(this.searchValue);
    }
  }

  onSerach(): void {
    this.store.dispatch(TodoListActions.search({
      search: this.searchValue
    }));
  }

  onClearSearch(): void {
    this.searchValue = '';
    this.onSerach();
  }
}
