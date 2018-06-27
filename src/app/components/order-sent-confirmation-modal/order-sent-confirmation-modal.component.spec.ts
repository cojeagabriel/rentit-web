import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSentConfirmationModalComponent } from './order-sent-confirmation-modal.component';

describe('OrderSentConfirmationModalComponent', () => {
  let component: OrderSentConfirmationModalComponent;
  let fixture: ComponentFixture<OrderSentConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSentConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSentConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
