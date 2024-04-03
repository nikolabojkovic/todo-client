import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ISearch } from '../../shared/models/search';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectSearch, selectSettings, selectSort } from '../../shared/state/todo.selectors';
import { IFilter } from '../../shared/models/filter';
import { ISort } from '../../shared/models/sort';
import { Subject, Subscription, concatMap, debounceTime, filter, first, tap } from 'rxjs';
import { ISettings } from '../../shared/models/settings';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  ifSearchIsEmpty = true;
  searchValue = '';
  filter!: IFilter;
  sort!: ISort;
  settings!: ISettings;
  faCircleXmark = faCircleXmark;
  private subscriptions: Subscription[] = [];
  private searchOnKeyup$ = new Subject<string>();

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
    this.subscriptions.push(this.store.select(selectFilter)
      .pipe()
      .subscribe((filter: IFilter) => {
        this.filter = filter;
      }));
    this.subscriptions.push(this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.sort = sort;
      }));
    this.subscriptions.push(
      this.store.select(selectSettings)
        .pipe(
          tap((settings: ISettings) => this.settings = settings),
          filter((settings: ISettings) => settings.search.isSearchOnKeyPressEnabled),
          concatMap((settings: ISettings) => this.searchOnKeyup$
            .pipe(
              filter((value: string) => !!value),
              debounceTime(settings.search.debounceTime),
            )),
        )
        .subscribe(() => this.onSerach())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      filter: this.filter,
      sort: this.sort,
      search: this.searchValue
    }));
  }

  onClearSearch(): void {
    this.searchValue = '';
    this.onSerach();
  }
}
