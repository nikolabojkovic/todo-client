import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSettingsComponent } from './general-settings.component';

describe('GeneralSettingsComponent', () => {
  let component: GeneralSettingsComponent;
  let fixture: ComponentFixture<GeneralSettingsComponent>;
  //let myService: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      //providers: [{ provide: MyService, useValue: {} }],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSettingsComponent);
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
