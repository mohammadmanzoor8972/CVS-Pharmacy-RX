import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLostOrDamagedCardComponent } from './report-lost-or-damaged-card.component';

describe('ReportLostOrDamagedCardComponent', () => {
  let component: ReportLostOrDamagedCardComponent;
  let fixture: ComponentFixture<ReportLostOrDamagedCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLostOrDamagedCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLostOrDamagedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
