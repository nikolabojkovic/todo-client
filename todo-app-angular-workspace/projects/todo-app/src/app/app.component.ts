import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from './shared/state/state';
import { selectActiveTab, selectSettings } from './shared/state/todo.selectors';
import { TodoListActions } from './shared/state/todo.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-client-angular';
  activeTab: string = 'add-todo';
  activeTab$ = this.store.select(selectActiveTab);
  settings$ = this.store.select(selectSettings);

  constructor(private store: Store<IState>) {}

  ngOnInit(): void {
    this.store.dispatch(TodoListActions.fetch());
    this.store.dispatch(TodoListActions.settingsFetch());
    this.store.dispatch(TodoListActions.pagingFetch());
  }
}
