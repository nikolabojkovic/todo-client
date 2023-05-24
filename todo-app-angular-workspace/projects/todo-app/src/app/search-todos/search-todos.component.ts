import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent implements OnInit {
  disabled = true;
  constructor() { }

  ngOnInit(): void { }
}
