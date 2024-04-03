import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoSettingsComponent } from './todo-settings.component';

describe('TodoSettingsComponent', () => {
  let component: TodoSettingsComponent;
  let fixture: ComponentFixture<TodoSettingsComponent>;
  // let myService: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      // providers: [{ provide: MyService, useValue: {} }],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // myService = TestBed.inject(MyService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(component).toBeTruthy();
    });
  });
});
