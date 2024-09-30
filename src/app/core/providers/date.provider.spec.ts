import { TestBed } from '@angular/core/testing';

import { DateProvider } from './date.provider';

describe('DateService', () => {
  let service: DateProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
