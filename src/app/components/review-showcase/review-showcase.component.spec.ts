import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewShowcaseComponent } from './review-showcase.component';

describe('ReviewShowcaseComponent', () => {
  let component: ReviewShowcaseComponent;
  let fixture: ComponentFixture<ReviewShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
