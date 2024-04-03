import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from './shared/state/state';
import { selectActiveTab, selectSettings } from './shared/state/todo.selectors';
import { TodoListActions } from './shared/state/todo.actions';
import { Subscription } from 'rxjs';
import { ISettings } from './shared/models/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-client-angular';
  activeTab: string = 'add-todo';
  settings!: ISettings;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<IState>) {}

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(selectActiveTab)
      .pipe()
      .subscribe((activeTab: string) => this.activeTab = activeTab));
    this.subscriptions.push(this.store.select(selectSettings)
      .pipe()
      .subscribe((settings: ISettings) => this.settings = settings));
    this.store.dispatch(TodoListActions.fetch());
    this.store.dispatch(TodoListActions.settingsFetch());
    this.store.dispatch(TodoListActions.pagingFetch());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
