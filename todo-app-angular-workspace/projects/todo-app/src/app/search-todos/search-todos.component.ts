import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  searchButton = { 
    backgroundColor: '#FE9801',
    color: 'white', 
    minWidth: '90px',
    borderRadius: '20px',
    width: '100%'
  };
  disabled = true;
  searchValue = '';
  
  constructor() { }

  ngOnInit(): void { }

  onTyping(): void {
    this.disabled = !this.searchValue || this.searchValue.trim() === '';
  }

  onSerach(): void {
    console.log(this.searchValue);
  }
}
