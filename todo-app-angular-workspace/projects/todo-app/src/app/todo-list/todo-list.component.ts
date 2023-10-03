import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { selectTodoDisplayList } from '../state/todo.selectors';
import { TodoListActions } from '../state/todo.actions';
import { ITodo } from '../shared/models/todo';
import { ITodoList } from '../shared/models/todoList';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$: Observable<ITodo[]> = this.store.select(selectTodoDisplayList);

  constructor(private todoService: TodoService, private store: Store<ITodoList>) { }

  ngOnInit(): void {
    let data = this.todoService.getTodoList();
    this.store.dispatch(TodoListActions.fetched({ todoList: data }));
  }
}
