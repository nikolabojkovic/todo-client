import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/todoList';
import { TodoListActions } from '../state/todo.actions';
import { selectFilter } from '../state/todo.selectors';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  isCompleted = false;
  isUncompleted = false;

  constructor(private store: Store<ITodoList>) { }

  ngOnInit(): void { 
    this.store.select(selectFilter)
        .pipe()
        .subscribe((filter: any) => {
          this.isCompleted = filter.completed;
          this.isUncompleted = filter.uncompleted;
        });
  }

  onFilter(): void {
    this.store.dispatch(TodoListActions.filtered({ 
      activePage: 1,
      filter: {
        completed: this.isCompleted,
        uncompleted: this.isUncompleted
      }
    }));
  }
}
