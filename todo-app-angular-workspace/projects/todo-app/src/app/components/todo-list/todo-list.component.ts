import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, combineLatestWith, delay } from 'rxjs';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { IState, selectLoader, selectTodoDisplayList, selectTodos } from '../../shared/state';
import { ISettings,  ITodo,  ListContainerType } from '../../shared/models';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {

  public readonly ListContainerType : typeof ListContainerType = ListContainerType;
  readonly todoItemheight = 55;
  faAngleDown = faAngleDown;

  settings?: ISettings;
  items: Array<ITodo> = [];
  infiniteScroll = {
    startIndex: 0,
    endIndex: 5,
    isLoading: false,
    fetch: new Subject<number>()
  };
  originalListLength = 0;

  isLoading$: Observable<boolean> = this.store.select(selectLoader);
  todoState$: Observable<IState> = this.store.select(selectTodos);

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);

    this.subscriptions.push(this.todoState$.pipe().subscribe((state: IState) => {
      this.originalListLength = state.originalList.length;
      this.settings = state.settings;

      if (state.settings.general.isPaginationEnabled) {
        this.items = state.displayList.slice(state.paging.startIndex, state.paging.endIndex);
        return;
      }

      if (state.settings.general.isInfiniteScrollEnabled) {
        this.infiniteScroll = {
          ...this.infiniteScroll,
          endIndex: this.calculateinfiniteScrollEndIndex(state.settings),
          isLoading: false
        };
        this.items = state.displayList.slice(0, this.infiniteScroll.endIndex);
        return;
      }

      this.items = state.displayList;
    }));

    this.subscriptions.push(this.store.select(selectTodoDisplayList)
      .pipe(
        combineLatestWith(this.infiniteScroll.fetch),
        delay(1000)
      )
      .subscribe(([items, endIndex]: [Array<ITodo>, number]) => {
        this.infiniteScroll = {...this.infiniteScroll, endIndex: endIndex + 5, isLoading: false};
        this.items = items.slice(0, this.infiniteScroll.endIndex );
      })
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleScroll = () => {
    if (!this.settings?.general?.isInfiniteScrollEnabled || this.infiniteScroll.isLoading) {
      return;
    }

    let { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (this.settings?.general?.listSizeType === ListContainerType.Fixed) {
      scrollTop = document.getElementById('todo-list-container')!.scrollTop;
      clientHeight = document.getElementById('todo-list-container')!.clientHeight;
      scrollHeight = document.getElementById('todo-list-container')!.scrollHeight;
    }

    if ((scrollTop + clientHeight >= scrollHeight - 20)
     && !this.infiniteScroll.isLoading
     && this.infiniteScroll.endIndex < this.originalListLength) {
      this.infiniteScroll = {...this.infiniteScroll, isLoading: true };
      this.infiniteScroll.fetch.next(this.infiniteScroll.endIndex);
    }
  };

  private calculateinfiniteScrollEndIndex(settings: ISettings): number {
    return (settings.general.listSizeType === ListContainerType.Fixed
      ? ((settings.general.fixedListSize) / this.todoItemheight)
      : (document.documentElement.clientHeight - 200) / this.todoItemheight);
  }
}
