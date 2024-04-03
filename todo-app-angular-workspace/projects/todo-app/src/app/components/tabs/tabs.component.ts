import { Component } from '@angular/core';
import { faAdd, faSearch, faFilter, faDownload, faGear, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';

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
    } as Tab,
    {
      name: 'todo-settings',
      icon: faGear
    } as Tab
  ];

  active = 'add-todo';

  constructor(private store: Store<IState>) {}

  setTab(name: string): void {
    this.active = name;
    this.store.dispatch(TodoListActions.activeTabChanged({
      activeTab: this.active
    }));
  }

  tabTrackBy(index: number, tab: Tab) {
    return tab.name;
  }
}
