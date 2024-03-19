import { Component } from '@angular/core';
import { faAdd, faSearch, faFilter, faDownload, IconDefinition } from '@fortawesome/free-solid-svg-icons';

type Tab = {
  name: string,
  icon: IconDefinition,
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  tabs: Tab[] = [{
      name: 'add-todo',
      icon: faAdd,
    } as Tab,
    {
      name: 'search-todos',
      icon: faSearch
    } as Tab,
    {
      name: 'filter-todos',
      icon: faFilter
    } as Tab,
    {
      name: 'import-export',
      icon: faDownload
    } as Tab
  ];

  active = 'add-todo';

  setTab(name: string): void {
    this.active = name;
  }

  tabTrackBy(index: number, tab: Tab) {
    return tab.name;
  }
}
