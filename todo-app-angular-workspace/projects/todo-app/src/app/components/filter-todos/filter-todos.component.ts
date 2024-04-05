import { Component, OnInit } from '@angular/core';
import { Observable, first } from 'rxjs';
import { Store } from '@ngrx/store';

import { IFilter, StateFilter } from '../../shared/models';
import { IState, TodoListActions, selectFilter, selectLoader } from '../../shared/state';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  stateFilter: StateFilter = StateFilter.all;
  StateFilter = StateFilter;
  isLoading$: Observable<boolean> = this.store.select(selectLoader);

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.store.select(selectFilter)
      .pipe(
        first()
      )
      .subscribe((filter: IFilter) => {
        this.stateFilter = filter.state;
      });
  }

  onFilter(state: StateFilter): void {
    this.stateFilter = state;
    this.store.dispatch(TodoListActions.filter({
      filter: { state: state } as IFilter,
    }));
  }
}
