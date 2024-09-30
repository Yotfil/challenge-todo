import { TestBed } from '@angular/core/testing';

import { MapSkillsProvider } from './map-skills.provider';

describe('MapSkillsService', () => {
  let service: MapSkillsProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSkillsProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
