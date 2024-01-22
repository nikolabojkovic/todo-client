import { ITodo } from '../../shared/models/todo';
import { Observable, of } from 'rxjs';
import { IFilter } from '../../shared/models/filter';
import { ISort } from '../../shared/models/sort';

export class MockTodoService {
  getList(filter: IFilter | null = null , sort: ISort | null = null, searchTerm: string | null = null): Observable<ITodo[]> {
    return of([] as ITodo[]);
  }

  saveList(list: ITodo[]): Observable<any> {
    return of({});
  }
}