import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodoListActions } from '../../shared/state/todo.actions';
import { IState } from '../../shared/state/state';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  title = ''
  description = ''

  constructor(private store: Store<IState>) { }

  ngOnInit(): void { }

  onAdd() {
    this.store.dispatch(TodoListActions.added({
      title: this.title,
      description: this.description,
    }));
    this.title = '';
    this.description = '';
  }

  get ifDataIsMissing(): boolean {
    return this.title.trim() === '' || this.description.trim() === ''
  }
}
