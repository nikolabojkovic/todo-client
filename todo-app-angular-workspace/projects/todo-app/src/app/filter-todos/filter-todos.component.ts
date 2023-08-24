import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { TodosActions } from '../state/todos.actions';
import { selectTodos } from '../state/todos.selectors';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  isCompleted = false;
  isUncompleted = false;

  constructor(private store: Store) { }

  ngOnInit(): void { 
    this.store.select(selectTodos)
        .pipe()
        .subscribe((todoList: ITodoList) => {
          this.isCompleted = todoList.filter.completed;
          this.isUncompleted = todoList.filter.uncompleted;
        });
  }

  onFilter(): void {
    this.store.dispatch(TodosActions.todosFiltered({ 
      action: {        
        activePage: 1,
        filter: { 
          completed: this.isCompleted,
          uncompleted: this.isUncompleted
        }
      }
    }));
  }
}
