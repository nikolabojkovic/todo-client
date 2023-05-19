import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortButtonLibComponent } from './sort-button-lib.component';

describe('SortButtonLibComponent', () => {
  let component: SortButtonLibComponent;
  let fixture: ComponentFixture<SortButtonLibComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortButtonLibComponent]
    });
    fixture = TestBed.createComponent(SortButtonLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
