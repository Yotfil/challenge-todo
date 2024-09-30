import { TestBed } from '@angular/core/testing';

import { MapUsersProvider } from './map-users.provider';

describe('MapUsersService', () => {
  let service: MapUsersProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapUsersProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
