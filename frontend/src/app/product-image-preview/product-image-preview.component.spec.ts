import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagePreviewComponent } from './product-image-preview.component';

describe('ProductImagePreviewComponent', () => {
  let component: ProductImagePreviewComponent;
  let fixture: ComponentFixture<ProductImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
