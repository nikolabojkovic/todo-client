export interface IFilter {
  state: StateFilter;
}

export enum StateFilter {
  all = 'All',
  completed = 'Completed',
  uncompleted = 'Uncompleted'
}
