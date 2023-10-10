import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ISearch } from '../../shared/models/search';
import { ITodoList } from '../../shared/models/todoList';
import { TodoService } from '../../shared/services/todo.service';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectSearch, selectTodos } from '../../shared/state/todo.selectors';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  ifSearchIsEmpty = true;
  searchValue = '';
  
  constructor(private store: Store<ITodoList>, private todoService: TodoService) { }

  ngOnInit(): void { 
    this.store.select(selectSearch)
        .pipe()
        .subscribe((search: ISearch) => {
          this.searchValue = search.searchTerm;
          this.ifSearchIsEmpty = search.searchTerm === ''
        });
  }

  onTyping(): void {
    this.ifSearchIsEmpty = !this.searchValue || this.searchValue.trim() === '';
    this.store.dispatch(TodoListActions.searchTermUpdated({ 
      searchTerm: this.searchValue ? this.searchValue.trim() : ''
    }));

    if (this.searchValue.trim() === '') {
      this.onSerach();
    }
  }

  onSerach(): void {
    this.store.select(selectTodos)
    .pipe(first())
    .subscribe((todoList: ITodoList) => {
      const filteredList = this.todoService.filter(todoList.originalList, todoList.filter);
      const searchedList = this.todoService.search(filteredList, this.searchValue);
  
      this.store.dispatch(TodoListActions.searched({ 
        searchTerm: this.searchValue,
        activePage: 1,
        list: searchedList
      }));
    });
  }
}
