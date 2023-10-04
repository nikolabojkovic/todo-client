import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { IPaging } from '../../shared/models/paging';
import { ITodoList } from '../../shared/models/todoList';
import { TodoListActions } from '../../state/todo.actions';
import { selectPaging } from '../../state/todo.selectors';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  totalCount: number = 0;
  pageCount: number = 1;
  activePage: number = 1;
  itemsPerPage: number = 1;

  constructor(private store: Store<ITodoList>) {}

  ngOnInit(): void {
    this.store.select(selectPaging)
        .pipe()
        .subscribe((paging: IPaging) => {
          this.totalCount = paging.totalCount;
          this.itemsPerPage = paging.itemsPerPage;
          this.activePage = paging.activePage;
          this.pageCount = Math.ceil(paging.totalCount / paging.itemsPerPage);
        });
  }

  onPageChange(event: PageChangedEvent) {
    this.store.dispatch(TodoListActions.pagingUpdated({ 
      activePage: event.page,
      itemsPerPage: this.itemsPerPage
    }));
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.store.dispatch(TodoListActions.pagingUpdated({ 
      activePage: 1,
      itemsPerPage: this.itemsPerPage
    }));
  }
}
