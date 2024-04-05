import { Store } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { faCheckDouble, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ITodo, ISettings } from '../../shared/models';
import { IState, TodoListActions, selectSettings } from '../../shared/state';
import { ConfirmModalService } from '../';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, OnDestroy {
  @Input() todo: ITodo = {} as ITodo;
  faCheckDouble = faCheckDouble;
  faTrash = faTrash;
  settings!: ISettings;
  private subscription!: Subscription;

  constructor(private store: Store<IState>, private modalService: ConfirmModalService) {}

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => this.settings = settings);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onComplete() {
    if (this.todo.completed)
      return;

    if (!this.settings?.general?.isConfirmEnabled) {
      this.store.dispatch(TodoListActions.completed({ todoId: this.todo.id }));
      return;
    }

    this.modalService.confirm('Are you sure you want to complete this item?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.completed({ todoId: this.todo.id }));
      }
    });
  }

  onRemove() {
    if (!this.settings?.general?.isConfirmEnabled) {
      this.store.dispatch(TodoListActions.removed({ todoId: this.todo.id }));
      return;
    }

    this.modalService.confirm('Are you sure you want to delete this item?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.removed({ todoId: this.todo.id }));
      }
    });
  }
}
