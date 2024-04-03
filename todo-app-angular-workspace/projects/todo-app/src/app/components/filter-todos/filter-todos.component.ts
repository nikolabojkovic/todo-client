import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IFilter, StateFilter } from '../../shared/models/filter';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectLoader, selectSearch, selectSort } from '../../shared/state/todo.selectors';
import { ISort } from '../../shared/models/sort';
import { ISearch } from '../../shared/models/search';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  search: string = '';
  sort!: ISort;

  constructor(private store: Store<IState>) { }

  stateFilter: StateFilter = StateFilter.all;
  StateFilter = StateFilter;
  isLoading$: Observable<boolean> = this.store.select(selectLoader);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(selectFilter)
        .pipe()
        .subscribe((filter: IFilter) => {
          this.stateFilter = filter.state;
        }));
    this.subscriptions.push(this.store.select(selectSearch)
      .pipe()
      .subscribe((search: ISearch) => {
        this.search = search.searchTerm;
      }));
    this.subscriptions.push(this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.sort = sort;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onFilter(state: StateFilter): void {
    this.stateFilter = state;
    this.store.dispatch(TodoListActions.filter({
      filter: { state: state } as IFilter,
      sort: this.sort,
      search: this.search
    }));
  }
}
