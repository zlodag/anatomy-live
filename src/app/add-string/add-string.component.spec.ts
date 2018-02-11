import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStringComponent } from './add-string.component';

describe('AddStringComponent', () => {
  let component: AddStringComponent;
  let fixture: ComponentFixture<AddStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
