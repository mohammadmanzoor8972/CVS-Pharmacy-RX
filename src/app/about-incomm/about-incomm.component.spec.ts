import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutIncommComponent } from './about-incomm.component';

describe('AboutIncommComponent', () => {
  let component: AboutIncommComponent;
  let fixture: ComponentFixture<AboutIncommComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutIncommComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutIncommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
