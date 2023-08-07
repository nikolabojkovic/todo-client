import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodosActions } from '../state/todos.actions';
import { selectTodos } from '../state/todos.selectors';
import { TodoService } from '../shared/services/todo.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  addButton = { 
    backgroundColor: '#FE9801',
    color: 'white', 
    minWidth: '90px',
    borderRadius: '20px',
    width: '100%'
  };
  title = ''
  description = ''

  constructor(private store: Store, private todoService: TodoService) { }

  ngOnInit(): void { }
  
  async onAdd() {
    this.store.dispatch(TodosActions.addTodo({
      title: this.title,
      description: this.description,
    }));
    this.store
        .select(selectTodos)
        .pipe(first())
        .subscribe((todos: any) => this.todoService.saveTodos(todos));
  }

  get disabledButtonState(): boolean {
    return !this.title 
      || this.title.trim() === '' 
      || !this.description 
      || this.description.trim() === ''
  }
}
