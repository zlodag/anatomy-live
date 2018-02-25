import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailListComponent } from './item-detail-list.component';

describe('ItemDetailListComponent', () => {
  let component: ItemDetailListComponent;
  let fixture: ComponentFixture<ItemDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
