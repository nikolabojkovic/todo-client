import { Component, forwardRef, OnInit } from '@angular/core';

import {
  GeneralSettingsComponent,
  PaginationSettingsComponent,
  SearchSettingsComponent
} from '../';

@Component({
  standalone: true,
  imports: [
    forwardRef(() => GeneralSettingsComponent),
    forwardRef(() => SearchSettingsComponent),
    forwardRef(() => PaginationSettingsComponent)
  ],
  selector: 'app-todo-settings',
  templateUrl: './todo-settings.component.html',
  styleUrls: ['./todo-settings.component.scss']
})
export class TodoSettingsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
