import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ISearch } from '../../shared/models/search';
import { IState } from '../../shared/state/state';
import { TodoService } from '../../shared/services/todo.service';
import { TodoListActions } from '../../shared/state/todo.actions';
import { selectSearch, selectTodos } from '../../shared/state/todo.selectors';
import { ITodo } from '../../shared/models/todo';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  ifSearchIsEmpty = true;
  searchValue = '';
  faCircleXmark = faCircleXmark;
  
  constructor(private store: Store<IState>, private todoService: TodoService) { }

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
    .subscribe((todoList: IState) => {
      this.todoService.getList(
        todoList.filter, 
        todoList.sort,
        this.searchValue)
        .pipe(first())
        .subscribe((list: ITodo[]) => { 
          this.store.dispatch(TodoListActions.searched({ 
            searchTerm: this.searchValue,
            activePage: 1,
            list: list
          }));
      });
    });
  }

  onClearSearch(): void {
    this.searchValue = '';
    this.onSerach();
  }
}
