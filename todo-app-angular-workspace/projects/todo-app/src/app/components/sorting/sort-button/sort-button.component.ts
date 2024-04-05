import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';

import { ISort, SortDirection } from '../../../shared/models';
import { IState, TodoListActions, selectLoader, selectSort } from '../../../shared/state';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit, OnDestroy {
  @Input() column: string = '';
  @Input() text: string = '';

  sortDirection!: string;
  isLoading: boolean = false;
  private subscription!: Subscription;

  constructor(private store: Store<IState>, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.select(selectSort)
      .pipe(
        first()
      )
      .subscribe((sort: ISort) => {
        this.sortDirection = sort.column === this.column ? sort.direction : SortDirection.None;
      });
    this.subscription = this.store.select(selectLoader)
      .pipe()
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSort(): void {
    if (this.isLoading) {
      return;
    }

    this.sortDirection = this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;
    this.store.dispatch(TodoListActions.sort({
      sort: {
        column: this.column,
        direction: this.sortDirection
      } as ISort
    }));
  }
}
