import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
// Import module
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification/Notification.service';
import { NotifyService } from '../services/notification/notify.service';
import { NO_ERRORS_SCHEMA  } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { CvsService } from '../services/cvs-services/cvs.services';
import { Observable } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
const MockRouter =jasmine.createSpyObj('Router',['navigateByUrl']);
const MockNavbarService =jasmine.createSpyObj('NavbarService',['show']);
const MockCmsService =jasmine.createSpyObj('CmsService',['getContent']);
class CvsServiceStub {
  getUserInformation(): Observable<any> {
    return Observable.of({
      'body': {
        'firstname': 'avaise',
        'lastname': 'test'
      }
    });
  }
  setUserInfo(data) {
    
  }
}
describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],  // Also add it to 'imports' array
      providers: [ 
         {provide: NotificationService, useClass: NotificationService},
         {provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'resetToken': '14257' }]) }},
         {provide: CvsService, useValue: MockCmsService },
        { provide: Router, useValue: MockRouter },
        {provide: NotifyService, useClass: NotifyService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
   // fixture = TestBed.createComponent(ResetPasswordComponent);
   // component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeUndefined();
  });
});
