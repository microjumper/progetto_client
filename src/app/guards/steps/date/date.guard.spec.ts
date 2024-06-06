import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dateGuard } from './date.guard';

describe('dateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
