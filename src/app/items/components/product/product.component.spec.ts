import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtuctComponent } from './product.component';

describe('ProtuctComponent', () => {
  let component: ProtuctComponent;
  let fixture: ComponentFixture<ProtuctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtuctComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtuctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
