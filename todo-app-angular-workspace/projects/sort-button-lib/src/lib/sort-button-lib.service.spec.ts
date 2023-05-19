import { TestBed } from '@angular/core/testing';

import { SortButtonLibService } from './sort-button-lib.service';

describe('SortButtonLibService', () => {
  let service: SortButtonLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortButtonLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
