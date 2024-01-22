import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TodoService } from '../../shared/services/todo.service';
import { SearchTodosComponent } from "./search-todos.component";

describe("SearchTodosComponent", () => {
  let component: SearchTodosComponent;
  let fixture: ComponentFixture<SearchTodosComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchTodosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [TodoService],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    todoService = TestBed.inject(TodoService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(component).toBeTruthy();
    });

  });
})
