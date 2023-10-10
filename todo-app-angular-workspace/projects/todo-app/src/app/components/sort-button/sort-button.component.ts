import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ISort, SortDirection } from '../../shared/models/sort';
import { ITodoList } from '../../shared/models/todoList';
import { TodoService } from '../../shared/services/todo.service';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectSort, selectTodos } from '../../shared/state/todo.selectors';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = "";
  @Input() text: string = "";

  sortDirection!: string;

  constructor(private store: Store<ITodoList>, private todoService: TodoService) {}

  ngOnInit(): void {    
    this.store.select(selectSort)
    .pipe()
    .subscribe((sort: ISort) => {
      this.sortDirection = sort.column === this.column ? sort.direction : SortDirection.None;
    });
  }

  sort(): void {
    this.store.select(selectTodos)
    .pipe(first())
    .subscribe((todoList: ITodoList) => {
      const sort = { 
        column: this.column, 
        direction: this.sortDirection !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc
      } as ISort
      const filteredList = this.todoService.filter(todoList.originalList, todoList.filter);
      const searchedList = this.todoService.search(filteredList, todoList.search.searchTerm);
      const sortedList = this.todoService.sort(searchedList, sort as ISort);
  
      this.store.dispatch(TodoListActions.sorted({
        sort,
        list: sortedList 
      }));
    });
  }
}
