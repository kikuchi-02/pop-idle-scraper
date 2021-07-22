import { TestBed } from '@angular/core/testing';

import { CrdtTextService } from './crdt-text.service';

describe('CrdtTextService', () => {
  let service: CrdtTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrdtTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
