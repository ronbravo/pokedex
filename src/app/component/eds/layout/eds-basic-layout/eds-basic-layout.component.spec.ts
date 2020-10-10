import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsBasicLayoutComponent } from './eds-basic-layout.component';

describe('EdsBasicLayoutComponent', () => {
  let component: EdsBasicLayoutComponent;
  let fixture: ComponentFixture<EdsBasicLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdsBasicLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdsBasicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
