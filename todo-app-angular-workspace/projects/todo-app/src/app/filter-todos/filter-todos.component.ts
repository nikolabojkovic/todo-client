import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-todos',
  templateUrl: './filter-todos.component.html',
  styleUrls: ['./filter-todos.component.scss']
})
export class FilterTodosComponent implements OnInit {
  isCompleted = false;
  isUncompleted = false;

  constructor() { }

  ngOnInit(): void { }

  onFilter(): void {
    // TODO: save state
  }
}
