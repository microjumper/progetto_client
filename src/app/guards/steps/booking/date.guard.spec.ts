import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bookingGuard } from './bookingGuard';

describe('dateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => bookingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
