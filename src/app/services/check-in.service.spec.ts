/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckInService } from './check-in.service';

describe('Service: CheckIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckInService]
    });
  });

  it('should ...', inject([CheckInService], (service: CheckInService) => {
    expect(service).toBeTruthy();
  }));
});
