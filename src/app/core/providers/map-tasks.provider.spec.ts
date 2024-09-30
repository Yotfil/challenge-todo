import { TestBed } from '@angular/core/testing';

import { MapTasksProvider } from './map-tasks.provider';

describe('MapTasksService', () => {
  let service: MapTasksProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapTasksProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
