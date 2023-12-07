import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { selectLoader, selectTodoDisplayList } from '../../shared/state/todo.selectors';
import { TodoListActions } from '../../shared/state/todo.actions';
import { ITodo } from '../../shared/models/todo';
import { IState } from '../../shared/state/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$: Observable<ITodo[]> = this.store.select(selectTodoDisplayList);
  isLoading$: Observable<boolean> = this.store.select(selectLoader);

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    this.store.dispatch(TodoListActions.loadingStarged());
    this.store.dispatch(TodoListActions.fetch());
  }
}
