import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodoListActions } from '../state/todo.actions';
import { ITodoList } from '../shared/models/todoList';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  title = ''
  description = ''

  constructor(private store: Store<ITodoList>) { }

  ngOnInit(): void { }
  
  async onAdd() {
    this.store.dispatch(TodoListActions.added({
      title: this.title,
      description: this.description,
    }));
  }

  get disabledButtonState(): boolean {
    return !this.title 
      || this.title.trim() === '' 
      || !this.description 
      || this.description.trim() === ''
  }
}
