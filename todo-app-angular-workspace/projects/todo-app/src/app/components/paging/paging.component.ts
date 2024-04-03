import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IPaging } from '../../shared/models/paging';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectPaging, selectSettings } from '../../shared/state/todo.selectors';
import { Subscription } from 'rxjs';
import { ISettings, PaginationType } from '../../shared/models/settings';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  totalCount: number = 0;
  pageCount: number = 1;
  activePage: number = 0;
  itemsPerPage: number = 1;
  maxVisiblePages: number = 3;
  rotate: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<IState>, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(selectPaging)
        .pipe()
        .subscribe((paging: IPaging) => {
          this.totalCount = paging.totalCount;
          this.itemsPerPage = paging.itemsPerPage;
          this.pageCount = Math.ceil(paging.totalCount / paging.itemsPerPage);
          this.activePage = 1;
          this.ref.detectChanges();
          this.activePage = paging.activePage;
          this.ref.detectChanges();
      }));
    this.subscriptions.push(
      this.store.select(selectSettings)
      .pipe()
      .subscribe((settings: ISettings) => {
        this.maxVisiblePages = settings.pagination.maxVisiblePages;
        this.rotate = settings.pagination.paginationType === PaginationType.Rotate;
        this.ref.detectChanges();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onPageSizeChange(pageSize: number) {
    this.itemsPerPage = pageSize;
    this.store.dispatch(TodoListActions.pagingUpdated({
      activePage: 1,
      itemsPerPage: this.itemsPerPage
    }));
  }

  onPageClick() {
    this.store.dispatch(TodoListActions.pagingUpdated({
      activePage: this.activePage,
      itemsPerPage: this.itemsPerPage
    }));
  }
}
