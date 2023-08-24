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
  title = ''
  description = ''

  constructor(private store: Store, private todoService: TodoService) { }

  ngOnInit(): void { }
  
  async onAdd() {
    this.store.dispatch(TodosActions.addedTodo({
      title: this.title,
      description: this.description,
    }));
    this.store
        .select(selectTodos)
        .pipe(first())
        .subscribe((todos: any) => { 
          this.todoService.saveTodos(todos);
          this.title = '';
          this.description = ''
         });
  }

  get disabledButtonState(): boolean {
    return !this.title 
      || this.title.trim() === '' 
      || !this.description 
      || this.description.trim() === ''
  }
}
