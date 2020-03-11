import { TestBed } from '@angular/core/testing';

import { YelpapiService } from './yelpapi.service';

describe('YelpapiService', () => {
  let service: YelpapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YelpapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
