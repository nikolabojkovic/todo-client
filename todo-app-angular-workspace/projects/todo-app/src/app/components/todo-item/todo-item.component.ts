import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { ITodo } from '../../shared/models/todo';
import { TodoListActions } from '../../state/todo.actions';
import { ITodoList } from '../../shared/models/todoList';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() todo: ITodo = {} as ITodo;

  constructor(private store: Store<ITodoList>) {}

  onComplete(todoId: number) {
    this.store.dispatch(TodoListActions.completed({ todoId }));
  }

  onRemove(todoId: number) {
    this.store.dispatch(TodoListActions.removed({ todoId }));
  }
}
