import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBasicLayoutComponent } from './ui-basic-layout.component';

describe('UiBasicLayoutComponent', () => {
  let component: UiBasicLayoutComponent;
  let fixture: ComponentFixture<UiBasicLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiBasicLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiBasicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
