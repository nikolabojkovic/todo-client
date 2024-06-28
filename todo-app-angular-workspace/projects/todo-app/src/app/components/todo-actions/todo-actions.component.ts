import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';

import { faTrash, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

import { ConfirmModalService } from '..';
import { IState, TodoListActions, selectSettings } from '../../shared/state';
import { ISettings } from '../../shared/models';

@Component({
  selector: 'app-todo-actions',
  templateUrl: './todo-actions.component.html',
  styleUrls: ['./todo-actions.component.scss']
})
export class TodoActionsComponent implements OnInit {

  faTrash = faTrash;
  faRotateLeft = faRotateLeft;
  settings!: ISettings;
  private subscription!: Subscription;

  constructor(private store: Store<IState>, private modalService: ConfirmModalService) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectSettings)
        .pipe()
        .subscribe((settings: ISettings) => {
          this.settings = settings;
        });
  }

  onRestoreAll(): void {
    if (!this.settings?.general?.isConfirmEnabled) {
      this.store.dispatch(TodoListActions.restoredAll());
      return;
    }

    this.modalService.confirm('Are you sure you want to restore all items?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.restoredAll());
      }
    });
  }

  onRemoveAll(): void {
    if (!this.settings?.general?.isConfirmEnabled) {
      this.store.dispatch(TodoListActions.removedAll());
      return;
    }

    this.modalService.confirm('Are you sure you want to remove all items?', 'modal-sm')
    .pipe(first())
    .subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(TodoListActions.removedAll());
      }
    });
  }
}
