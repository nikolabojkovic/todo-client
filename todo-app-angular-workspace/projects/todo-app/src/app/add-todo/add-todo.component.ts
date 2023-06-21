import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TodosActions } from '../state/todos.actions';

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

  constructor(private store: Store) { }

  ngOnInit(): void { }
  
  onAdd() {
    this.store.dispatch(TodosActions.addTodo({
      title: this.title,
      description: this.description,
    }));
    // console.log(todo);
  }

  get buttonState(): boolean {
    return !this.title 
      || this.title.trim() === '' 
      || !this.description 
      || this.description.trim() === ''
  }
}
