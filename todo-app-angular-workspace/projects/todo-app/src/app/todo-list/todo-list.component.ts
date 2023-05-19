import { Component, OnInit } from '@angular/core';
import { todos } from '../shared/initial-data';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items: any = todos;

  constructor() { }

  ngOnInit(): void { }
}
