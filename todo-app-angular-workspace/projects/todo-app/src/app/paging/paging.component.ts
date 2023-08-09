import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ITodoList } from '../shared/models/ITodoList';
import { TodosActions } from '../state/todos.actions';
import { selectTodos } from '../state/todos.selectors';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  totalCount: number = 0;
  pageCount: number = 0;
  activePage: number = 2;
  itemsPerPage: number = 1;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectTodos)
        .pipe()
        .subscribe((todoList: ITodoList) => {
          this.totalCount = todoList.paging.totalCount;
          this.itemsPerPage = todoList.paging.itemsPerPage;
          this.activePage = todoList.paging.activePage;
          this.pageCount = Math.ceil(this.totalCount / todoList.paging.itemsPerPage);
        });
  }

  onPageChange(event: PageChangedEvent) {
    this.store.dispatch(TodosActions.pagingUpdated({ 
      action: {
        activePage: event.page,
        itemsPerPage: this.itemsPerPage
      }
    }));
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.store.dispatch(TodosActions.pagingUpdated({ 
      action: {
        activePage: 1,
        itemsPerPage: this.itemsPerPage
      }
    }));
  }
}
