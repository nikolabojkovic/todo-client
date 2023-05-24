import { Component } from '@angular/core';
import { faAdd, faSearch, faFilter, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  tabs = [{
      name: 'add-todo',
      icon: faAdd,
    },
    {
      name: 'search-todos',
      icon: faSearch
    },
    {
      name: 'filter-todos',
      icon: faFilter
    },
    {
      name: 'import-export',
      icon: faDownload
    }
  ];

  active = 'add-todo'

  setTab(name: string): void {
    this.active = name;
  }
}
