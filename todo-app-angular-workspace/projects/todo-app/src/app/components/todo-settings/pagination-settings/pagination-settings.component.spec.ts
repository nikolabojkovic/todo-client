import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationSettingsComponent } from './pagination-settings.component';

describe('PaginationSettingsComponent', () => {
  let component: PaginationSettingsComponent;
  let fixture: ComponentFixture<PaginationSettingsComponent>;
  //let myService: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      //providers: [{ provide: MyService, useValue: {} }],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //myService = TestBed.inject(MyService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(component).toBeTruthy();
    });
  });
});
