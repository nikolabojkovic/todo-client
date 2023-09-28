import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { TodosActions } from '../state/todos.actions';
import { selectTodos } from '../state/todos.selectors';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = "";
  @Input() text: string = "";

  sortDirection: any;

  constructor(private store: Store) {}

  ngOnInit(): void {    
    this.store.select(selectTodos)
    .pipe()
    .subscribe((todoList: ITodoList) => {
      this.sortDirection = todoList.sort.column === this.column ? todoList.sort.direction : 'none';
    });
  }

  sort(): void {
    this.store.dispatch(TodosActions.sorted({ 
      action: {        
        sort: {
          ...{
            column: this.column, 
            direction: this.sortDirection !== 'asc' ? 'asc' : 'desc'
          }
        }
      }
    }));
  }
}
