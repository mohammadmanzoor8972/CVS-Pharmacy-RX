import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { Router, NavigationEnd } from '@angular/router';
import { CmsService } from '../services/cms.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NotificationService } from '../services/notification/Notification.service';
import { NavbarService } from '../navbar/navbar.service';
import { Observable } from 'rxjs';

import { NotifyComponent } from '../notify/notify.component';
import { NotifyService } from '../services/notification/notify.service';
import { UserService } from '../services/user.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import {Subject} from 'rxjs/Subject';


// const MockRouter =jasmine.createSpyObj('Router',['navigateByUrl']);
const MockCmsService =jasmine.createSpyObj('CmsService',['getContent']);
const MockNotificationService =jasmine.createSpyObj('NotificationService',['success']);
const MockNavbarService =jasmine.createSpyObj('NavbarService',['show']);
// const MockUserService = jasmine.createSpyObj('UserService', ['show']);

class MockUserService {
  isLoggedIn() {
    return true;
  }
}

class MockCvsService {
  changePassword(): Observable<any> {
    return Observable.of({body: {payload: {}}});
  }
  setUserInfo() {}
}


// class MockRouter {
//   public events = new Subject<any>();
//   navigateByUrl() {}
// }

class MockRouter {
  public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
  public events = new Observable(observer => {
    observer.next(this.ne);
    observer.complete();
  });
}


// MockRouter.events = Observable.of({body: {payload: {}}});
class MockNotifyService {
  public setMessage = new Subject<NotifyEnum>();
  public messageType: NotifyEnum;
  public autoLoggedOff: Boolean = false;
  public completedPersonalInfo: Boolean = false;

  constructor() {
    this.autoLoggedOff = false;
    this.completedPersonalInfo = false;
  }
}


fdescribe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ReactiveFormsModule, FormsModule],
      declarations: [ ChangePasswordComponent, NotifyComponent ],
      providers:[
        {provide: Router, useClass: MockRouter},
        {provide: CmsService, useValue: MockCmsService},
        {provide: CvsService, useClass: MockCvsService},
        {provide: NotificationService, useValue: MockNotificationService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: UserService, useClass: MockUserService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(MockCmsService.getContent).toHaveBeenCalled();
  });

  it('should call submit method', () => {
    expect(MockCmsService.getContent).toHaveBeenCalled();
    component.onSubmit();
    expect(component).toBeTruthy();
  });

  it('should call setView method', () => {
    component.setView({fields:{}});
    expect(component.view).toBeDefined();
  });

  it('should call inputFocused method', () => {
    component.inputFocused();
    expect(component.password_limits).toBeTruthy();
  });

  it('should call looseFocus method', () => {
    component.looseFocus();
    expect(component.password_limits).toBeFalsy();
  });
});
