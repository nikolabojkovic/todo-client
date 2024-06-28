import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISort, SortDirection, SortType } from '../../shared/models';
import { Subscription } from 'rxjs';
import { IState, TodoListActions, selectSort } from '../../shared/state';
import { Store } from '@ngrx/store';
import { SortAction } from './sort-button/sort-button.component';

type Sort = {
  name: string,
  text: string,
  sortType: SortType
}

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit, OnDestroy {
  sortByColumns: Sort[] = [
    {
      name: 'title',
      text: 'Title',
      sortType: SortType.direction
    } as Sort,
    {
      name: 'description',
      text: 'Description',
      sortType: SortType.direction
    } as Sort,
    {
      name: 'createdAt',
      text: 'Date',
      sortType: SortType.direction
    } as Sort,
    {
      name: 'completed',
      text: 'Completed',
      sortType: SortType.direction
    } as Sort,
    {
      name: 'sortId',
      text: 'Manual order',
      sortType: SortType.noDirection
    } as Sort
  ];

  activeColumn?: string;
  private subscriptions: Subscription[] = [];

  public readonly SortDirection : typeof SortDirection = SortDirection;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(selectSort)
      .pipe()
      .subscribe((sort: ISort) => {
        this.activeColumn = sort.column;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleSort(event: SortAction): void {
    this.activeColumn = event.column;
    this.store.dispatch(TodoListActions.sort({
      sort: {
        column: event.column,
        direction: event.direction
      } as ISort
    }));
  }
}
