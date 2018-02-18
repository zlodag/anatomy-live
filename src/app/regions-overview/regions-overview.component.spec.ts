import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionsOverviewComponent } from './regions-overview.component';

describe('RegionsOverviewComponent', () => {
  let component: RegionsOverviewComponent;
  let fixture: ComponentFixture<RegionsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
