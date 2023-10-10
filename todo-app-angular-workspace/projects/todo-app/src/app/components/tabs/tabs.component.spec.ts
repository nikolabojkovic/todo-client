import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { inMemoryTodoListTestData } from '../../shared/test-data';
import { ITodoList } from '../../shared/models/todoList';

import { TabsComponent } from './tabs.component';
import { FormsModule } from '@angular/forms';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let store: MockStore<ITodoList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent, AddTodoComponent],
      imports: [FontAwesomeModule, FormsModule],
      providers: [provideMockStore({ inMemoryTodoListTestData } as any),]
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
