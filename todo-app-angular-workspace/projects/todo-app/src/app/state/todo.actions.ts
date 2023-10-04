import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IFilter } from '../shared/models/filter';
import { ITodoList } from '../shared/models/todoList';
import { ITodo } from '../shared/models/todo';

export const TodoListActions = createActionGroup({
  source: 'todos',
  events: {
    fetch: emptyProps(),
    fetched: props<{ todoList: ITodoList }>(),
    added: props<{ title: string, description: string }>(),
    completed: props<{ todoId: number }>(),
    removed: props<{ todoId: number }>(),
    searched: props<{ searchTerm: string, activePage: number }>(),
    pagingUpdated: props<{ activePage: number, itemsPerPage: number }>(),
    filtered: props<{ activePage: number, filter: IFilter }>(),
    imported: props<{ activePage: number, originalList: ITodo[] }>(),
    sorted: props< { column: string, direction: string }>(),
    searchTermUpdated: props< { searchTerm: string }>()
  }
});