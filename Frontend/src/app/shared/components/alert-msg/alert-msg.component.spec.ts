import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMsgComponent } from './alert-msg.component';

describe('AlertMsgComponent', () => {
  let component: AlertMsgComponent;
  let fixture: ComponentFixture<AlertMsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertMsgComponent]
    });
    fixture = TestBed.createComponent(AlertMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
