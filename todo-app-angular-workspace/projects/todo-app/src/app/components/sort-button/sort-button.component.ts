import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISort, SortDirection } from '../../shared/models/sort';
import { ITodoList } from '../../shared/models/todoList';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectSort } from '../../shared/state/todo.selectors';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = "";
  @Input() text: string = "";

  sortDirection!: string;

  constructor(private store: Store<ITodoList>) {}

  ngOnInit(): void {    
    this.store.select(selectSort)
    .pipe()
    .subscribe((sort: ISort) => {
      this.sortDirection = sort.column === this.column ? sort.direction : SortDirection.None;
    });
  }

  sort(): void {
    this.store.dispatch(TodoListActions.sorted({ 
      column: this.column, 
      direction: this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc
    } as ISort));
  }
}
