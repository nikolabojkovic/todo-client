import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { IState, selectLoader, selectSettings, selectTodoDisplayList } from '../../shared/state';
import { ITodo, ListContainerType } from '../../shared/models';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$: Observable<ITodo[]> = this.store.select(selectTodoDisplayList);
  isLoading$: Observable<boolean> = this.store.select(selectLoader);
  settings$ = this.store.select(selectSettings);
  public readonly ListContainerType : typeof ListContainerType = ListContainerType;

  constructor(private store: Store<IState>) { }

  ngOnInit(): void { }
}
