import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLandingPageComponent } from './transaction-landing-page.component';

xdescribe('TransactionLandingPageComponent', () => {
  let component: TransactionLandingPageComponent;
  let fixture: ComponentFixture<TransactionLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
