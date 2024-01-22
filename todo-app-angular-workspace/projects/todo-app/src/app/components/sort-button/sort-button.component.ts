import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ISort, SortDirection } from '../../shared/models/sort';
import { IState } from '../../shared/state/state';
import { TodoService } from '../../shared/services/todo.service';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectSort, selectTodos } from '../../shared/state/todo.selectors';
import { ITodo } from '../../shared/models/todo';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = "";
  @Input() text: string = "";

  sortDirection!: string;

  constructor(private store: Store<IState>, private todoService: TodoService) {}

  ngOnInit(): void {
    this.store.select(selectSort)
    .pipe()
    .subscribe((sort: ISort) => {
      this.sortDirection = sort.column === this.column ? sort.direction : SortDirection.None;
    });
  }

  sort(): void {
    this.store.dispatch(TodoListActions.loadingStarted());
    this.store.select(selectTodos)
    .pipe(first())
    .subscribe((todoList: IState) => {
      const sort = {
        column: this.column,
        direction: this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc
      } as ISort;

      this.todoService.getList(
        todoList.filter,
        sort,
        todoList.search.searchTerm)
        .pipe(first())
        .subscribe((list: ITodo[]) => {
          this.store.dispatch(TodoListActions.sorted({
            sort,
            list
          }));
      });
    });
  }
}
