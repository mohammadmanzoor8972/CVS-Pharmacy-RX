import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReloadUpdateComponent } from './auto-reload-update.component';

describe('AutoReloadUpdateComponent', () => {
  let component: AutoReloadUpdateComponent;
  let fixture: ComponentFixture<AutoReloadUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReloadUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReloadUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
