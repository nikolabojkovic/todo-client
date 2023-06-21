import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { ITodo } from '../shared/models/todo';
import { TodosActions } from '../state/todos.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() todo: ITodo = {} as ITodo;

  buttonStyle : any = { 
    backgroundColor: '#F5F6F7', 
    borderRadius: '20px', 
    minWidth: '90px'
  }

  constructor(private store: Store) {}

  onComplete(todoId: number) {
    this.store.dispatch(TodosActions.completeTodo({ todoId }));
  }

  onRemove(todoId: number) {
    this.store.dispatch(TodosActions.removeTodo({ todoId }));
  }
}
