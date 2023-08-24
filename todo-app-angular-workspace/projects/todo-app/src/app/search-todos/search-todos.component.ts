import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { TodosActions } from '../state/todos.actions';
import { selectTodos } from '../state/todos.selectors';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  disabled = true;
  searchValue = '';
  
  constructor(private store: Store) { }

  ngOnInit(): void { 
    this.store.select(selectTodos)
        .pipe()
        .subscribe((todoList: ITodoList) => {
          this.searchValue = todoList.search.searchTerm;
        });
  }

  onTyping(): void {
    this.disabled = !this.searchValue || this.searchValue.trim() === '';

    if (this.searchValue.trim() === '') {
      this.store.dispatch(TodosActions.searchedTodos({ 
        action: { 
          searchTerm: this.searchValue,
          activePage: 1
        }
      }));
    }
  }

  onSerach(): void {
    this.store.dispatch(TodosActions.searchedTodos({ 
      action: { 
        searchTerm: this.searchValue,
        activePage: 1
      }
    }));
    console.log(this.searchValue);
  }
}
