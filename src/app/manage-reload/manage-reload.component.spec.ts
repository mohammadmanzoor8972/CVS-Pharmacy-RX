import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReloadComponent } from './manage-reload.component';

describe('ManageReloadComponent', () => {
  let component: ManageReloadComponent;
  let fixture: ComponentFixture<ManageReloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
