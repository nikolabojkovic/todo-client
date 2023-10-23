import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { ITodo } from '../../shared/models/todo';
import { TodoListActions } from '../../shared/state/todo.actions';
import { IState } from '../../shared/state/state';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo: ITodo = {} as ITodo;

  constructor(private store: Store<IState>, private modalService: ConfirmModalService) {}

  onComplete(todoId: number) {
    this.modalService.confirm('Are you sure?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.completed({ todoId }));
      }      
    });    
  }

  onRemove(todoId: number) {
    this.modalService.confirm('Are you sure?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.removed({ todoId }));
      }      
    }); 
  }
}
