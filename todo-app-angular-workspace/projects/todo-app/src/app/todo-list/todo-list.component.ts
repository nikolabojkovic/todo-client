import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { selectTodos } from '../state/todos.selectors';
import { TodosActions } from '../state/todos.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$ = this.store.select(selectTodos);;

  constructor(private todoService: TodoService, private store: Store) { }

  ngOnInit(): void {
    let data = this.todoService.getTodos();
    this.store.dispatch(TodosActions.retrievedTodoList({ todos: data }));
  }

}
