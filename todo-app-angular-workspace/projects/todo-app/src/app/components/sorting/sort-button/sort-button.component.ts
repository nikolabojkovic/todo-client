import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { SortDirection, SortType } from '../../../shared/models';
import { IState, selectLoader } from '../../../shared/state';
// import { SortIconComponent } from '../';
import { NgClass, NgIf } from '@angular/common';

export type SortAction = {
  column: string,
  direction: SortDirection
}
@Component({
  standalone: true,
  imports: [
    //SortIconComponent,
    NgIf,
    NgClass
  ],
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit, OnDestroy {
  @Input() column: string = '';
  @Input() text: string = '';
  @Input() sortType: SortType = SortType.noDirection;
  @Input() sortDirection!: string;
  @Input() isActive = false;
  @Output() onSort = new EventEmitter<SortAction>();

  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  public readonly SortType : typeof SortType = SortType;

  constructor(private store: Store<IState>, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(selectLoader)
      .pipe()
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.ref.detectChanges();
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  onClick(): void {
    if (this.isLoading) {
      return;
    }

    this.sortDirection = this.sortType === SortType.direction
      ? (this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc)
      : SortDirection.None;

    this.isActive = this.sortType === SortType.noDirection;
    this.onSort.emit({ column: this.column, direction: this.sortDirection } as SortAction);
  }
}
