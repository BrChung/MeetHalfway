import { TestBed } from '@angular/core/testing';

import { GeofirexService } from './geofirex.service';

describe('GeofirexService', () => {
  let service: GeofirexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeofirexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
