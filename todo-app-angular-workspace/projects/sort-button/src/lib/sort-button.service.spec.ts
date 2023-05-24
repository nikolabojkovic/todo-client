import { TestBed } from '@angular/core/testing';

import { SortButtonService } from './sort-button.service';

describe('SortButtonService', () => {
  let service: SortButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
