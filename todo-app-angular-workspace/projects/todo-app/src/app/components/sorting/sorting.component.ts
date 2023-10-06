import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit {
  sortByColumns = [
    {
      name: 'title',
      text: 'Title'
    },
    {
      name: 'description',
      text: 'Description'
    },
    {
      name: 'createdAt',
      text: 'Date'
    },
    {
      name: 'completed',
      text: 'Completed'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
