import { TestBed } from '@angular/core/testing';

import { ScriptListService } from './script-list.service';

describe('ScriptListService', () => {
  let service: ScriptListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
