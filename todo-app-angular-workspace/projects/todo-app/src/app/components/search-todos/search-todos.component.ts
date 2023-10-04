import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../../shared/models/todoList';
import { TodoListActions } from '../../state/todo.actions';
import { selectSearch } from '../../state/todo.selectors';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  disabled = true;
  searchValue = '';
  
  constructor(private store: Store<ITodoList>) { }

  ngOnInit(): void { 
    this.store.select(selectSearch)
        .pipe()
        .subscribe((search: any) => {
          this.searchValue = search.searchTerm;
          this.disabled = search.searchTerm === ''
        });
  }

  onTyping(): void {
    this.disabled = !this.searchValue || this.searchValue.trim() === '';
    this.store.dispatch(TodoListActions.searchTermUpdated({ 
      searchTerm: this.searchValue ? this.searchValue.trim() : ''
    }));

    if (this.searchValue.trim() === '') {
      this.onSerach();
    }
  }

  onSerach(): void {
    this.store.dispatch(TodoListActions.searched({ 
      searchTerm: this.searchValue,
      activePage: 1
    }));
  }
}
