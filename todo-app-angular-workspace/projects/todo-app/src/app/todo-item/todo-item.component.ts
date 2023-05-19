import { Component, Input } from '@angular/core';
import { ITodo } from '../shared/models/todo';

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
}
