import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { IFilter } from '../../shared/models/filter';
import { ITodoList } from '../../shared/models/todoList';
import { TodoService } from '../../shared/services/todo.service';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectFilter, selectTodos } from '../../shared/state/todo.selectors';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  isCompleted = false;
  isUncompleted = false;

  constructor(private store: Store<ITodoList>, private todoService: TodoService) { }

  ngOnInit(): void { 
    this.store.select(selectFilter)
        .pipe()
        .subscribe((filter: IFilter) => {
          this.isCompleted = filter.completed;
          this.isUncompleted = filter.uncompleted;
        });
  }

  onFilter(): void {
    this.store.select(selectTodos)
    .pipe(first())
    .subscribe((todoList: ITodoList) => {
      const filter = {
        completed: this.isCompleted,
        uncompleted: this.isUncompleted
      } as IFilter
      const filteredList = this.todoService.filter(todoList.originalList, filter);
      const searchedList = this.todoService.search(filteredList, todoList.search.searchTerm);
  
      this.store.dispatch(TodoListActions.filtered({ 
        activePage: 1,
        filter,
        list: searchedList
      }));
    });

    
  }
}
