import { TestBed } from '@angular/core/testing';

import { CancellationService } from './cancellation.service';

describe('CancellationService', () => {
  let service: CancellationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancellationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
