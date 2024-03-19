import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SortIconComponent } from './sort-icon.component';

describe('SortIconComponent', () => {
  let component: SortIconComponent;
  let fixture: ComponentFixture<SortIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortIconComponent],
      imports: [FontAwesomeModule]
    });
    fixture = TestBed.createComponent(SortIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
