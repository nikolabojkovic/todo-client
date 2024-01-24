import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ISearch } from '../../shared/models/search';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectSearch, selectSort } from '../../shared/state/todo.selectors';
import { IFilter } from '../../shared/models/filter';
import { ISort } from '../../shared/models/sort';

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
  faCircleXmark = faCircleXmark;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.store.select(selectSearch)
      .pipe()
      .subscribe((search: ISearch) => {
        this.searchValue = search.searchTerm;
        this.ifSearchIsEmpty = search.searchTerm === ''
      });
    this.store.select(selectFilter)
      .pipe()
      .subscribe((filter: IFilter) => {
        this.filter = filter;
      });

    this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.sort = sort;
      });
  }

  onTyping(): void {
    this.ifSearchIsEmpty = !this.searchValue || this.searchValue.trim() === '';
    this.store.dispatch(TodoListActions.searchTermUpdated({
      searchTerm: this.searchValue ? this.searchValue.trim() : ''
    }));

    if (this.searchValue.trim() === '') {
      this.onSerach();
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
