import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { TodoListActions } from '../state/todos.actions';
import { selectSort } from '../state/todos.selectors';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() column: string = "";
  @Input() text: string = "";

  sortDirection: any;

  constructor(private store: Store<ITodoList>) {}

  ngOnInit(): void {    
    this.store.select(selectSort)
    .pipe()
    .subscribe((sort: any) => {
      this.sortDirection = sort.column === this.column ? sort.direction : 'none';
    });
  }

  sort(): void {
    this.store.dispatch(TodoListActions.sorted({ 
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
