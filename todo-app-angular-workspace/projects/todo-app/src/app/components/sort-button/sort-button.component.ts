import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISort, SortDirection } from '../../shared/models/sort';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectLoader, selectSearch, selectSort } from '../../shared/state/todo.selectors';
import { IFilter } from '../../shared/models/filter';
import { ISearch } from '../../shared/models/search';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = '';
  @Input() text: string = '';

  sortDirection!: string;
  filter!: IFilter;
  search: string = '';
  isLoading: boolean = false;

  constructor(private store: Store<IState>) {}

  ngOnInit(): void {
    this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.sortDirection = sort.column === this.column ? sort.direction : SortDirection.None;
      });
    this.store.select(selectFilter)
      .pipe()
      .subscribe((filter: IFilter) => {
        this.filter = filter;
      });
    this.store.select(selectSearch)
      .pipe()
      .subscribe((search: ISearch) => {
        this.search = search.searchTerm;
      });
    this.store.select(selectLoader)
    .pipe()
    .subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }

  onSort(): void {
    if (this.isLoading) {
      return;
    }

    this.sortDirection = this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;
    this.store.dispatch(TodoListActions.sort({
      filter: this.filter,
      sort: {
        column: this.column,
        direction: this.sortDirection
      } as ISort,
      search: this.search
    }));
  }
}
