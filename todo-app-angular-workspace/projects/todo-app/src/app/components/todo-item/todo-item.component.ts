import { Store } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { faCheckDouble, faTrash, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ITodo, ISettings } from '../../shared/models';
import { DisplayMode, IState, TodoListActions, selectSettings } from '../../shared/state';
import { ConfirmModalService } from '../';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, OnDestroy {

  @Input() todo: ITodo = {} as ITodo;

  faCheckDouble = faCheckDouble;
  faTrash = faTrash;
  faRotateLeft = faRotateLeft;
  settings!: ISettings;
  private subscription!: Subscription;

  public readonly DisplayMode : typeof DisplayMode = DisplayMode;

  constructor(private store: Store<IState>, private modalService: ConfirmModalService) {}

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => {
          this.settings = settings;
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onComplete(): void {
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

  onRestore(): void {
    if (!this.settings?.general?.isConfirmEnabled) {
      this.store.dispatch(TodoListActions.restored({ todoId: this.todo.id }));
      return;
    }

    this.modalService.confirm('Are you sure you want to restore this item?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.restored({ todoId: this.todo.id }));
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
