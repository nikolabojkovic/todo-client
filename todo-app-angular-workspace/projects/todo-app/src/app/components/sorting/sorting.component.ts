import { Component, OnInit } from '@angular/core';

type Sort = {
  name: string,
  text: string
}

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit {
  sortByColumns: Sort[] = [
    {
      name: 'title',
      text: 'Title'
    } as Sort,
    {
      name: 'description',
      text: 'Description'
    } as Sort,
    {
      name: 'createdAt',
      text: 'Date'
    } as Sort,
    {
      name: 'completed',
      text: 'Completed'
    } as Sort
  ];

  constructor() { }

  ngOnInit(): void { }
}
