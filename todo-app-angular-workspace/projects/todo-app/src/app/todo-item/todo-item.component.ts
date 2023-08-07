import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { ITodo } from '../shared/models/todo';
import { selectTodos } from '../state/todos.selectors';
import { TodosActions } from '../state/todos.actions';
import { TodoService } from '../shared/services/todo.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() todo: ITodo = {} as ITodo;

  buttonStyle : any = { 
    backgroundColor: '#F5F6F7', 
    borderRadius: '20px', 
    minWidth: '90px'
  }

  constructor(private store: Store, private todoService: TodoService) {}

  onComplete(todoId: number) {
    this.store.dispatch(TodosActions.completeTodo({ todoId }));
    this.store
        .select(selectTodos)
        .pipe(first())
        .subscribe((todos: any) => this.todoService.saveTodos(todos));
  }

  onRemove(todoId: number) {
    this.store.dispatch(TodosActions.removeTodo({ todoId }));
    this.store
        .select(selectTodos)
        .pipe(first())
        .subscribe((todos: any) => this.todoService.saveTodos(todos));
  }
}
