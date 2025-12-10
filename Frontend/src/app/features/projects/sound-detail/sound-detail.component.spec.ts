import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundDetailComponent } from './sound-detail.component';

describe('SoundDetailComponent', () => {
  let component: SoundDetailComponent;
  let fixture: ComponentFixture<SoundDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SoundDetailComponent]
    });
    fixture = TestBed.createComponent(SoundDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
