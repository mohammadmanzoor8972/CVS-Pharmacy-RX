import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReloadOptOutComponent } from './auto-reload-opt-out.component';

describe('AutoReloadOptOutComponent', () => {
  let component: AutoReloadOptOutComponent;
  let fixture: ComponentFixture<AutoReloadOptOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReloadOptOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReloadOptOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
