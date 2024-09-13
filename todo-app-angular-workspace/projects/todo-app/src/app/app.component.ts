import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

import {
  IState,
  selectActiveTab,
  selectSettings,
  TodoListActions
} from './shared/state';
import {
  PagingComponent,
  SortingComponent,
  TabsComponent,
  TodoActionsComponent,
  TodoListComponent
} from './components';

@Component({
  standalone: true,
  imports: [
    PagingComponent,
    SortingComponent,
    TabsComponent,
    TodoActionsComponent,
    TodoListComponent,
    CommonModule,
    NgIf
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeTab$ = this.store.select(selectActiveTab);
  settings$ = this.store.select(selectSettings);

  constructor(private store: Store<IState>) {}

  ngOnInit(): void {
    // this.store.dispatch(TodoListActions.fetch());
    // this.store.dispatch(TodoListActions.settingsFetch());
    // this.store.dispatch(TodoListActions.pagingFetch());
    this.store.dispatch(TodoListActions.loadApp());
  }
}
