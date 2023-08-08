import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { selectTodos } from '../state/todos.selectors';
import { TodosActions } from '../state/todos.actions';
import { ITodo } from '../shared/models/todo';
import { first } from 'rxjs';
import { ITodoList } from '../shared/models/ITodoList';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items: ITodo[] = [];

  constructor(private todoService: TodoService, private store: Store) { }

  ngOnInit(): void {
    let data = this.todoService.getTodoList();
    this.store.dispatch(TodosActions.retrievedTodoList({ todoList: data }));
    this.store.select(selectTodos)
        .pipe()
        .subscribe((todoList: ITodoList) => {
          this.items = todoList.displayList.slice(todoList.paging.startIndex, todoList.paging.endIndex)
          console.log(todoList.paging);
        });
  }

}
