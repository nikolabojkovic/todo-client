import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void { }

  add() {
    console.log(this.title);
    console.log(this.description);
  }

  get buttonState(): boolean {
    return !this.title 
      || this.title.trim() === '' 
      || !this.description 
      || this.description.trim() === ''
  }
}
