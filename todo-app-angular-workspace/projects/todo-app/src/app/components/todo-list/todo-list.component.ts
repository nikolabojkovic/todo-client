import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, combineLatestWith, delay } from 'rxjs';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { DisplayMode, IState, TodoListActions, selectLoader, selectTodoDisplayList, selectTodos } from '../../shared/state';
import { IPaging, ISettings,  ITodo,  ListContainerType } from '../../shared/models';
import { LoaderComponent, TodoItemComponent } from '../';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    LoaderComponent,
    TodoItemComponent,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder],
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, OnDestroy {

  public readonly ListContainerType : typeof ListContainerType = ListContainerType;
  public readonly DisplayMode : typeof DisplayMode = DisplayMode;

  readonly todoItemheight = 55;
  faAngleDown = faAngleDown;

  // From global state
  settings?: ISettings;
  items: Array<ITodo> = [];
  displayList: Array<ITodo> = [];
  originalList: Array<ITodo> = [];
  currentListSizeTypeState?: ListContainerType;
  displayMode: DisplayMode = DisplayMode.All;

  paging?: IPaging = undefined;

  // Infinite scroll local state
  infiniteScroll = {
    startIndex: 0,
    endIndex: 5,
    isLoading: false,
    fetch: new Subject<number>()
  };
  hasMoreItemsToLoad = false;

  isLoading$: Observable<boolean> = this.store.select(selectLoader);
  todoState$: Observable<IState> = this.store.select(selectTodos);

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<IState>) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);

    this.subscriptions.push(this.todoState$.pipe().subscribe((state: IState) => {
      this.settings = state.settings;
      this.paging = state.paging;
      this.originalList = state.originalList;
      this.displayList = state.displayList;
      this.displayMode = state.displayMode;

      if (state.settings.general.isPaginationEnabled) {
        this.items = [...state.displayList.slice(state.paging.startIndex, state.paging.endIndex)];
        return;
      }

      if (state.settings.general.isInfiniteScrollEnabled) {

        if (this.currentListSizeTypeState != state.settings.general.listSizeType) {
          this.infiniteScroll = {
            ...this.infiniteScroll,
            endIndex: this.calculateinfiniteScrollEndIndex(state.settings),
            isLoading: false
          };
          this.currentListSizeTypeState = state.settings.general.listSizeType;
        }

        this.items = [...state.displayList.slice(0, this.infiniteScroll.endIndex)];
        this.hasMoreItemsToLoad = this.infiniteScroll.endIndex < this.displayList.length;

        return;
      }

      this.items = [...state.displayList];
    }));

    this.subscriptions.push(this.store.select(selectTodoDisplayList)
      .pipe(
        combineLatestWith(this.infiniteScroll.fetch),
        delay(1000)
      )
      .subscribe(([items, endIndex]: [Array<ITodo>, number]) => {
        this.infiniteScroll = {...this.infiniteScroll, endIndex: endIndex + 5, isLoading: false};
        this.items = items.slice(0, this.infiniteScroll.endIndex );
        this.hasMoreItemsToLoad = this.infiniteScroll.endIndex < this.displayList.length;
      })
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get isDraggingEnabled(): boolean {
    return this.items.length > 0 && this.displayMode === DisplayMode.All;
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
     && this.hasMoreItemsToLoad) {
      this.infiniteScroll = {...this.infiniteScroll, isLoading: true };
      this.infiniteScroll.fetch.next(this.infiniteScroll.endIndex);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop(event: any) {
    const previousindex = event.previousIndex;
    const currentIndex = event.currentIndex;

    const items = this.reorder(
      this.originalList,
      previousindex,
      currentIndex
    );

   const list = [];
   let counter = 1;

   for (const item of items) {
    list.push({...item, sortId: counter++});
   }

    this.store.dispatch(TodoListActions.manuallySorted({ list }));
  }

  trackById = (index: number, item: ITodo): number => item.id;

  private calculateinfiniteScrollEndIndex(settings: ISettings): number {
    return (settings.general.listSizeType === ListContainerType.Fixed
      ? ((settings.general.fixedListSize) / this.todoItemheight)
      : (document.documentElement.clientHeight - 200) / this.todoItemheight);
  }

  private reorder = (list: Array<ITodo>, startIndex: number, endIndex: number) => {
    if (this.settings?.general.isPaginationEnabled && this.paging) {
      startIndex = startIndex + ((this.paging.activePage - 1) * this.paging.itemsPerPage);
      endIndex =  endIndex + ((this.paging.activePage - 1)  * this.paging.itemsPerPage);
    }

    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
}
