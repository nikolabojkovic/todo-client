import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IFilter } from '../../shared/models/filter';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectSearch, selectSort } from '../../shared/state/todo.selectors';
import { ISort } from '../../shared/models/sort';
import { ISearch } from '../../shared/models/search';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  isCompleted = false;
  isUncompleted = false;
  search: string = '';
  sort!: ISort;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.store.select(selectFilter)
        .pipe()
        .subscribe((filter: IFilter) => {
          this.isCompleted = filter.completed;
          this.isUncompleted = filter.uncompleted;
        });
    this.store.select(selectSearch)
      .pipe()
      .subscribe((search: ISearch) => {
        this.search = search.searchTerm;
      });
    this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.sort = sort;
      });
  }

  onFilter(): void {
    this.store.dispatch(TodoListActions.filter({
      filter: { completed: this.isCompleted, uncompleted: this.isUncompleted } as IFilter,
      sort: this.sort,
      search: this.search
    }));
  }
}
