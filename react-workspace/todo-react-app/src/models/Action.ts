export interface IAction {
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export enum TodoActions {
  fetch = 'fetch',
  filter = 'filter',
  search = 'search',
  sort = 'sort',

  fetched = 'fetched',
  filtered = 'filtered',
  sorted = 'sorted',
  searched = 'searched',
  imported = 'imported',
  loadingStarted = 'loading-started',
  activeTabChanged = 'active-tab-changed',

  searchTermUpdated = 'searchTerm-updated',
  pagingFatched = 'paging-fatched',
  pagingUpdated = 'paging-updated',
  settingsFetched = 'settings-fetched',
  settingsUpdated = 'settings-updated',

  added = 'added',
  changed = 'changed',
  deleted = 'deleted',
}