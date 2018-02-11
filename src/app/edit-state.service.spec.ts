import { TestBed, inject } from '@angular/core/testing';

import { EditStateService } from './edit-state.service';

describe('EditStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditStateService]
    });
  });

  it('should be created', inject([EditStateService], (service: EditStateService) => {
    expect(service).toBeTruthy();
  }));
});
