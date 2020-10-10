import { TestBed } from '@angular/core/testing';

import { HostAppService } from './host-app.service';

describe('HostAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HostAppService = TestBed.get(HostAppService);
    expect(service).toBeTruthy();
  });
});
