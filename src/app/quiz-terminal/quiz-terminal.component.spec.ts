import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTerminalComponent } from './quiz-terminal.component';

describe('QuizTerminalComponent', () => {
  let component: QuizTerminalComponent;
  let fixture: ComponentFixture<QuizTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
